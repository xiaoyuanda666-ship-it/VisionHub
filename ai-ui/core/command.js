import { addNode, removeNode } from "./store.js"
import { checkPermission } from "./permission.js"

export function handleCommand(cmd) {
  if (!checkPermission(cmd)) {
    console.error("Permission denied", cmd)
    return
  }

  if (cmd.action === "create") {
    const id = "node-" + Date.now()

    addNode({
      id,
      type: cmd.type,
      props: cmd.props
    })

    if (cmd.props?.duration) {
      setTimeout(() => removeNode(id), cmd.props.duration)
    }
  }
}