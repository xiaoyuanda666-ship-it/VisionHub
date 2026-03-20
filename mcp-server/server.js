import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "demo-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 定义一个工具
server.tool(
  "get_time",
  {
    city: "string"
  },
  async ({ city }) => {
    const time = new Date().toLocaleString();
    return {
      content: [
        {
          type: "text",
          text: `当前时间(${city})：${time}`
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);