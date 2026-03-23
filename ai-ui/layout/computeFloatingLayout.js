import { normalizeNode } from "./normalizeNode.js"

export function computeFloatingLayout(nodes) {
  return Object.values(nodes)
    .map(normalizeNode)
    .filter(n => n.layout.zone === "floating")
    .map((node, i) => {
      return {
        ...node,
        layout: {
          top: 80 + i * 110,
          left: 600 + i * 20,
          width: node.layout.width,
          height: node.layout.height,
          zone: "floating"
        }
      }
    })
}