// tests/DeepSeekClient.integration.test.js
import 'dotenv/config'
import { DeepSeekClient } from "../core/providers/DeepSeekClient.js"

describe.skip("DeepSeekClient real API test", () => {
  let client

  beforeAll(() => {
    client = new DeepSeekClient({ apiKey: process.env.DEEPSEEK_API_KEY })
  })

  test("pingHello should return non-empty text", async () => {
    const result = await client.pingHello()
    expect(result).toBe(true)
  })

  test("send should return LLMResponse with text", async () => {
    const res = await client.send([{ role: "user", content: "Say hello" }])
    expect(res.text.toLowerCase()).toContain("hello")
    expect(res.raw).toBeDefined()
  })
})