import fs from "fs";
import { HistoryManager } from "../utils/HistoryManager.js";
describe.skip("HistoryManager", () => {
  const testDir = "./conversation_test";
  beforeEach(() => {
    // 测试用文件夹，确保干净
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // 测试结束清理测试文件夹
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  test("滚动历史文件触发", () => {
    const windowSize = 30;
    const initialHistory = Array.from({ length: 378 }, (_, i) => ({ content: `msg${i}` }));

    const hm = new HistoryManager({ historyDir: testDir, windowSize, rollCount:330 });
    hm.history = [...initialHistory];

    hm._rollHistory();

    const recent = initialHistory.slice(-windowSize);

    // 新文件里应该只有最后 windowSize 条
    expect(hm.history.length).toBe(recent.length);
    expect(hm.history).toEqual(recent);

    // 文件夹里至少有两个文件（旧文件 + 新文件）
    const files = fs.readdirSync(testDir);
    expect(files.length).toBeGreaterThanOrEqual(2);
  });

  test("新文件开头为旧文件最后 windowSize 条", () => {
    const windowSize = 30;
    const initialHistory = Array.from({ length: 379 }, (_, i) => ({ content: `msg${i}` }));

    const hm = new HistoryManager({ historyDir: testDir, windowSize, rollCount:330 });
    hm.history = [...initialHistory];

    hm._rollHistory();

    const content = hm.history;
    const recent = initialHistory.slice(-windowSize);

    // 新文件内容必须是最近的 windowSize 条
    expect(content).toEqual(recent);
    expect(content[0].content).toBeDefined();
    expect(content[content.length - 1].content).toBeDefined();
  });
});