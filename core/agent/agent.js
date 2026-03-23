// core/agent/agent.js
import { HistoryManager } from "../../utils/HistoryManager.js";
import { getSystemPrompt } from "../../utils/systemPrompt.js";
import { MetaAbilityManager } from "./MetaAbilityManager.js";
import { LLMManager } from "../ai/LLMManager.js";
import { runTool } from "../agent/tools/toolRouter.js";
import { buildMessages } from "../memory/buildMessages.js";
import { MemoryManager } from "../memory/semanticMemory.js";
import { initEmbed } from "../ai/embed.js";
import WebSocket from "ws"; // 如果想要Agent持有一个websocket连接，可以这样引入WebSocket模块
import { OutputQueue } from "./outputQueue.js"
import { AgentState } from "../memory/agentState.js"
import { SkillManager } from "./SkillManager.js"

export class Agent {
  constructor(name) {
    this.historyManager = new HistoryManager({ historyDir: "./conversation" });
    this.systemPrompt = getSystemPrompt() || "Default system prompt";
    this.metaAbilityManager = new MetaAbilityManager();
    this.wsID = null;
    this.name = name;
    this.queue = []; // 统一事件队列
    this.processing = false;
    this.processingPromise = null;
    this.skillManager = new SkillManager(["./FileSystem/skills/"]);
    this.activeSkill = null

    this.semanticMemory = new MemoryManager();   // ← 加这一行

    this.llm = new LLMManager(); // LLM 管理器
    this.ws = new WebSocket("ws://localhost:8082"); // 初始化WebSocket连接
    this.agentState = new AgentState(); // 初始化Agent状态管理器
  }

  async init() {
    await initEmbed();
    this.skillManager.loadSkills();
    this.agentState.init(); // 初始化Agent状态管理器
    await this.semanticMemory.init(); // 初始化记忆管理器
    await this.llm.init(); // 初始化LLM管理器
    this.ws.on("open", () => {
      console.log("Connected to dispatcher")
    })
    this.ws.on("close", () => {
      console.log("DisConnected to dispatcher")
    })
    this.ws.on("message",async  (data) => {
      const d = JSON.parse(data.toString());
      console.log(d);
      if (d.type === "welcome") {
        this.WebSocketID = d.id
        console.log(`client ID is: ${this.WebSocketID}`)
        return
      }
      if (!d.content) {
        return;
      }
        this.enqueueEvent({ type: "message", content: d.content });
    });
      if(!this.agentState.getIdentity("name")){
        this.agentState.setIdentity("name", this.name); // 设置Agent身份信息
        this.agentState.setIdentity("self", "who am I? 我需要先调用 modify_self工具修改自我认知"); // 设置Agent身份信息
        this.agentState.set("nowMemory", "刚刚完成初始化，正在建立记忆")
        this.agentState.set("recentConversationSummary", "暂时没有任何对话总结")
        this.agentState.set("subconscious", "暂时没有任何潜意识")
        this.agentState.set("talkingTo", "暂时没有任何对话对象")
      }
    }
  enqueueEvent(event) {
    if (event.type === "message") {
    // 用户消息最高优先级
    this.queue = []
    this.queue.unshift(event)
    } else {
      if(!this.processing) {
        this.queue.push(event)
      }else {
        return
      }
    }
    this.triggerProcess();
  }

  triggerProcess() {
    if (!this.processing) this.processingPromise = this.process();
    return this.processingPromise;
  }

  async process() {
    if (this.processing) return this.processingPromise;
    this.processing = true;

    while (this.queue.length > 0) {
      const event = this.queue.shift();

      if (event.type === "tick") {
        this.historyManager.pushHistory({ role: "user", content: event.content });
        await handleMessageGeneric(this, event.content);
        // await this.metaAbilityManager.tickAll({ agent: this, message: event.time });
        continue;
      }

      if (event.type === "message") {
        await handleMessageGeneric(this, event.content);
      }
    }

    this.processing = false;
  }
}

const output = new OutputQueue()

async function getSubconscious(agent, message){
  const messages = `你是关联词生成器，生成的关联词要和用户输入紧密相关，用空格隔开，严格遵循输出格式,不管用户说什么，你都要生成最关联的一个到十个关键词 如果是系统 Tick，就原封不动返回，响应示例：(xx xx xx xx xx xx xx xx xx xx)
  注意事项，不要问问题，不要返回多余的解释，不要返回多余的文字，只输出关联关键词`
  const response = await agent.llm.call("MiniMax-M2.7", [
    { role: "system", content: messages },
    { role: "user", content: message }
  ]);

  return response.content;
}

// =============================
// 通用消息处理
// =============================
export async function handleMessageGeneric(agent, message) {
  let msgObj;
  try {
    msgObj = JSON.parse(message);
  } 
  catch {
    if (typeof message === "string" && message.startsWith("[系统Tick]")) {
      msgObj = { role: "user", content: message };
    } else {
      msgObj = { role: "user", content: message };
    }
  }

  // 如果是系统 Tick，直接更新潜意识，但不存历史
  const isTick = typeof msgObj.content === "string" && msgObj.content.startsWith("[系统Tick]");

  // const subconscious = await getSubconscious(agent, msgObj.content);
  // agent.agentState.set("subconscious", subconscious);

  // 只存非 Tick 消息
  if (!isTick) {
    msgObj.content = msgObj.content != null ? String(msgObj.content) : "";
    agent.historyManager.pushHistory({ role: msgObj.role || "user", content: msgObj.content });
  }
  // ===== RAG：检索记忆 =====
  const messages = await buildMessages({
  semanticMemory: agent.semanticMemory,
  agentState: agent.agentState,
  skillManager: agent.skillManager,
  activate_skill: agent.activate_skill,
  userInput: msgObj.content,
  query: msgObj.content,
  types: ["recent","longterm"]
})

// console.log("messages",messages)

  const MAX_HISTORY = 50;
  const context = buildContext(agent, MAX_HISTORY);

  const response = await agent.llm.call("MiniMax-M2.7", [
    { role: "user", content: messages },
    ...context
  ]);

  console.log("[Agent-001]:");
  // output.push(response.content, 2000)
  // const messageToWebSocket = {
  //   from: agent.WebSocketID,
  //   content: response
  // }

  // agent.WebSocket.send(JSON.stringify(messageToWebSocket))

  // ===== 模型调用工具处理 =====
  if (response.tool_calls?.length > 0) {
    agent.historyManager.pushHistory({ role: "tool", content: String(response.content || ""), tool_calls: response.tool_calls });

    for (const call of response.tool_calls) {
      let args = {};
      try { args = JSON.parse(call.function.arguments); } catch {}
      const result = (await runTool(call.function.name, args, {
        semanticMemory: agent.semanticMemory,
        skillManager: agent.skillManager,
        activate_skill: agent.activate_skill,
        agentState: agent.agentState,
        agent: agent,
        ws: agent.ws,
        wsID: agent.wsID
      })) ?? "[tool returned nothing]";
      agent.historyManager.pushHistory({ 
        role: "assistant", 
        tool_call_id: call.id, 
        content: typeof result === "string" ? result : JSON.stringify(result) 
      });
    }

    // 工具执行后再次调用 LLM
    const contextAfterTool = buildContext(agent, MAX_HISTORY);
    // output.push(contextAfterTool, 3000)
    const second = await agent.llm.call("MiniMax-M2.7", [
      { role: "system", content: agent.systemPrompt },
      ...contextAfterTool
    ]);
    output.push(second.content, 2000)

    agent.historyManager.pushHistory({ role: "assistant", content: String(second.content || "").trim() });
  } else {
    agent.historyManager.pushHistory({ role: "assistant", content: String(response.content || "").trim() });
  }
}

// =============================
// 历史上下文构建（兼容工具调用）
// =============================
function buildContext(agent, max = 20) {
  const history = agent.historyManager.history;
  const context = [];

  for (let i = history.length - 1; i >= 0 && context.length < max; i--) {
    const msg = history[i];

    // 只保留 system/user/assistant 消息，assistant 消息可携带 tool_calls
    if (["assistant", "user", "system"].includes(msg.role)) {
      const entry = { role: msg.role, content: msg.content || "" };
      if (msg.tool_calls) entry.tool_calls = msg.tool_calls;
      context.unshift(entry);
    }
  }

  return context;
}