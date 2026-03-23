import { normalizeNode } from "./normalizeNode.js"

const ITEM_HEIGHT = 48
const GAP = 8
const PADDING_TOP = 20
const PADDING_LEFT = 10

export function computeSidebarLayout(nodes) {
  let y = PADDING_TOP

  return Object.values(nodes)
    .map(normalizeNode)
    .filter(n => n.layout.zone === "sidebar")
    .map(node => {
      const layout = {
        top: y,
        left: PADDING_LEFT,
        width: 220,
        height: ITEM_HEIGHT,
        zone: "sidebar"
      }

      y += ITEM_HEIGHT + GAP

      return {
        ...node,
        layout
      }
    })
}