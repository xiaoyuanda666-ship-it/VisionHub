#!/usr/bin/env node
import { Command } from "commander"
import { start } from '../commands/visioncore-start.js'
import { status } from '../commands/visioncore-status.js'
import { stop } from '../commands/visioncore-stop.js'

const program = new Command()

program
  .name("visioncore")
  .description("visioncore CLI - continuous thinking agent")
  .version("1.0.0")

program
  .command("start")
  .description("start visioncore system")
  .action(async () => {
    start()
  })

program
  .command("status")
  .description("status visioncore system")
  .action(async () => {
    status()
  })

program
  .command("stop")
  .description("stop visioncore system")
  .action(async () => {
    stop()
  })

if (process.argv.length <= 2) {
  program.help()
}

program.on('command:*', () => {
  console.error('Unknown command')
  program.help()
});

program.parse(process.argv)