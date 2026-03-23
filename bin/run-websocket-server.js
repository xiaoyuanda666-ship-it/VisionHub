import { startSocketServer } from "../websocket/server/socketServer"

export async function start() {
  await startSocketServer()
}

start()