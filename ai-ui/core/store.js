import { render } from "./renderer.js"

export const store = {
  nodes: {}
}

export function addNode(node) {
  store.nodes[node.id] = { ...node, visible: true }
  render(store)
}

export function removeNode(id) {
  const node = store.nodes[id]
  if (!node) return

  node.visible = false
  render(store)

  setTimeout(() => {
    delete store.nodes[id]
    render(store)
  }, 300)
}