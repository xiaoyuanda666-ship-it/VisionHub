// engine/LLMManager.js
import { loadAllClients } from "../../managers/apiKeyManager.js" // 导入所有客户端
export class LLMManager {
  constructor() {
    this.clients = {}        // provider -> client
    this.modelMap = {}       // model -> provider
    this.ready = false
  }

  async init() {
    this.clients = await loadAllClients()
    // 建立 model -> provider 映射
    // 可以根据你的系统需要继续扩展
    for (const provider of Object.keys(this.clients)) {

      if (provider === "deepseek") {
        this.modelMap["deepseek-chat"] = "deepseek"
      }
      if (provider === "openai") {
        this.modelMap["gpt-4o-mini"] = "openai"
        this.modelMap["gpt-4o"] = "openai"
      }
      if (provider === "minimax") {
        this.modelMap["MiniMax-M2.7"] = "minimax"
      }
    }
    this.ready = true
  }

  getProviders() {
    return Object.keys(this.clients)
  }

  getModels() {
    return Object.keys(this.modelMap)
  }

  hasProvider(provider) {
    return !!this.clients[provider]
  }

  hasModel(model) {
    return !!this.modelMap[model]
  }

  getClientByModel(model) {
    const provider = this.modelMap[model]
    if (!provider) {
      throw new Error(`Model not registered: ${model}`)
    }
    const client = this.clients[provider]
    if (!client) {
      throw new Error(`Provider not available: ${provider}`)
    }
    return client
  }
  async call(model, messages, options = {}) {
    if (!this.ready) {
      throw new Error("LLMManager not initialized")
    }
    const client = this.getClientByModel(model)
    const res = await client.send(messages, options)

    // 如果是 DeepSeekClient 返回 { text, tool_calls, raw }
    // 转成统一 { content, tool_calls, raw }
    return {
      content: res.content ?? res.text ?? "",
      tool_calls: res.tool_calls ?? [],
      raw: res
    }
  }
}