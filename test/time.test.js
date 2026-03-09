import { pad, nowString, sleep } from "../utils/time.js";

describe("pad", () => {
  test("should pad single digit numbers with 0", () => {
    expect(pad(3)).toBe("03");
    expect(pad(0)).toBe("00");
  });

  test("should not change double digit numbers", () => {
    expect(pad(12)).toBe("12");
    expect(pad(99)).toBe("99");
  });
});

describe("nowString", () => {
  test("should return a string in YYYY-MM-DD HH:mm:ss format", () => {
    const str = nowString();
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    expect(regex.test(str)).toBe(true);
  });
});