import { loadAllClients, registerApiKey } from "../managers/apiKeyManager.js"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"

const log = console.log
const green = chalk.hex('#7ccf7c')
const yellow = chalk.hex('#f8eaa7')

// 全局唯一 spinner
const spinner = ora()

export async function start() {
  log(green('Starting visioncore system...'))
  log(green('checking LLM configuration...'))
  const clients = await ensureConfig()
  if (!clients) return
  await validateExistingClient(clients)
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