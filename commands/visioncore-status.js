import fs from "fs";
import path from "path";
import chalk from "chalk";

const log = console.log;
const red = chalk.hex("#d45454");
const green = chalk.hex("#7ccf7c");

const pidPath = path.resolve(process.cwd(), ".visioncore-websocket.pid");

export function status() {
  if (!fs.existsSync(pidPath)) {
    log(red("VisionCore stopped ✖"));
    return;
  }

  const raw = fs.readFileSync(pidPath, "utf-8");
  const pid = Number(raw);

  if (!pid || Number.isNaN(pid)) {
    log(red("VisionCore stopped ✖ (bad pid)"));
    return;
  }

  try {
    process.kill(pid, 0);
    log(green(`VisionCore running ✔ PID: ${pid}`));
  } catch {
    log(red("VisionCore stopped ✖"));
  }
}