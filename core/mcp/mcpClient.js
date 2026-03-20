import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class MCPClient {
  constructor() {
    this.client = null;
  }

  async init() {
    const transport = new StdioClientTransport({
      command: "node",
      args: ["mcp-server/server.js"]
    });

    this.client = new Client(
      {
        name: "agent-client",
        version: "1.0"
      },
      {
        capabilities: {}
      }
    );

    await this.client.connect(transport);
  }

  async callTool(name, args) {
    const result = await this.client.request({
      method: "tools/call",
      params: {
        name,
        arguments: args
      }
    });

    return result;
  }
}