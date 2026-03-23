import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pidPath = path.resolve(__dirname, "../visioncore-websocket.pid")

export function stop() {
  if (!fs.existsSync(pidPath)) {
    console.log("VisionCore not running ✖");
    return;
  }

  const pid = Number(fs.readFileSync(pidPath, "utf-8"));

  if (!pid || Number.isNaN(pid)) {
    console.log("Invalid PID ✖");
    return;
  }

  try {
    process.kill(pid, "SIGTERM"); // 礼貌停止

    fs.unlinkSync(pidPath); // 删除 pid 文件

    console.log("VisionCore stopped ✔");
  } catch (err) {
    console.log("Failed to stop process ✖");
  }
}