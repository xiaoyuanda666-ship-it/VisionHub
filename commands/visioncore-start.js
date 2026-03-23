import { loadAllClients, registerApiKey } from "../managers/apiKeyManager.js"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// const childPath = path.join(__dirname, "../websocket/server/socketServer.js")
const childPath = path.join(__dirname, "../")

import { spawn } from "child_process";
import { pid } from "process"

const log = console.log
const green = chalk.hex('#7ccf7c')
const yellow = chalk.hex('#f8eaa7')

const spinner = ora()

export async function start() {
  log(green('Starting visioncore system...'))
  log(green('checking LLM configuration...'))
  const clients = await ensureConfig()
  if (!clients) return
  await validateExistingClient(clients)
  const child = spawn("node", [childPath], {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (data) => {
    console.log("[child]", data.toString());
  });

  child.stderr.on("data", (data) => {
    console.error("[child error]", data.toString());
  });

  child.unref();

  const pidPath = path.resolve(__dirname, "../visioncore-websocket.pid");
  console.log("writing pid to:", pidPath);

  fs.writeFileSync(pidPath, String(child.pid));
  console.log("started pid:", child.pid);
}

async function ensureConfig() {
  spinner.start('loading keys...')
  let clients = await loadAllClients()
  spinner.stop()

  if (!clients || Object.keys(clients).length === 0) {
    log(yellow('No API key found'))
    return await promptAndRegisterKey()
  }
  return clients
}

async function validateExistingClient(clients) {
  const provider = Object.keys(clients)[0]
  const client = clients[provider]
  spinner.start('validating API key...')

  try {
    const ok = await client.pingHello()
    if (!ok) throw new Error('invalid')
    spinner.succeed(' API key is valid')
    log(green(`Provider ready: ${provider}`))

    return true
  } catch (err) {
    spinner.fail(' API key invalid')
    log(yellow('Re-enter your API key'))
    const newClients = await promptAndRegisterKey()
    return await validateExistingClient(newClients)
  }
}

async function promptAndRegisterKey() {
  const { apiKey } = await prompts({
    type: 'password',
    name: 'apiKey',
    message: 'Enter your API key'
  })

  spinner.start('detecting provider...')
  const result = await registerApiKey(apiKey)
  spinner.succeed(` Provider detected: ${result.provider}`)
  log(green(`Provider ready: ${result.provider}`))
  return { [result.provider]: result.client }
}