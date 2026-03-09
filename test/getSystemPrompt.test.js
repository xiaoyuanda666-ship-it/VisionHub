// getSystemPrompt.test.js
import { getSystemPrompt } from "../utils/systemPrompt.js";
import fs from "fs";
import path from "path";

describe("getSystemPrompt (real files)", () => {
  const configPath = path.resolve("./config.json");
  const promptPath = path.resolve("./prompt.txt");

  beforeAll(() => {
    // 写真实文件
    fs.writeFileSync(configPath, JSON.stringify({ systemPromptFile: "./prompt.txt" }), "utf-8");
    fs.writeFileSync(promptPath, "This is the system prompt.", "utf-8");
  });

  afterAll(() => {
    // 清理测试文件
    fs.unlinkSync(configPath);
    fs.unlinkSync(promptPath);
  });

  it("should read system prompt from config file", () => {
    const result = getSystemPrompt();
    expect(result).toBe("This is the system prompt.");
  });
});