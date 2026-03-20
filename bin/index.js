#!/usr/bin/env node
import { Command } from "commander"
import { start } from '../commands/visioncore-start.js'

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

if (process.argv.length <= 2) {
  program.help()
}

program.on('command:*', () => {
  console.error('Unknown command')
  program.help()
});

program.parse(process.argv)