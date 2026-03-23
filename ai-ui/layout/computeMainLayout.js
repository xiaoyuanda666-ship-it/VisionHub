import { normalizeNode } from "./normalizeNode.js"

const GAP = 12
const PADDING_TOP = 20
const PADDING_LEFT = 20

export function computeMainLayout(nodes) {
  let y = PADDING_TOP

  return Object.values(nodes)
    .map(normalizeNode)
    .filter(n => n.layout.zone === "main")
    .sort((a, b) => (b.layout.priority - a.layout.priority))
    .map(node => {
      const { width, height } = node.layout

      const layout = {
        top: y,
        left: PADDING_LEFT,
        width,
        height,
        zone: "main"
      }

      y += height + GAP

      return {
        ...node,
        layout
      }
    })
}