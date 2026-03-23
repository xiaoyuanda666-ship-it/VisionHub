import { tools } from "./tools.js"
import { eventBus } from "./eventBus.js"

export class Router {
  constructor(agent) {
    this.agent = agent
  }

  async handle(msg, context = {}) {
    if (msg.type !== "chat") {
      return { error: "only chat supported" }
    }

    // 1. agent 思考
    const result = await this.agent.run(msg.input, context)

    // 2. tool 调用
    if (result.tool) {
      const tool = tools[result.tool]

      if (!tool) {
        return { error: "tool not found" }
      }

      const toolResult = await tool(result.args)

      // 3. 广播事件（可选）
      eventBus.emitEvent("tool:done", {
        tool: result.tool,
        result: toolResult
      })

      return {
        type: "tool_result",
        data: toolResult
      }
    }

    // 4. 普通回复
    eventBus.emitEvent("agent:reply", result)

    return {
      type: "text",
      data: result.text
    }
  }
}