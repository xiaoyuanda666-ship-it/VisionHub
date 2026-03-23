import { computeMainLayout } from "./computeMainLayout.js"
import { computeSidebarLayout } from "./computeSidebarLayout.js"
import { computeFloatingLayout } from "./computeFloatingLayout.js"

export function computeLayout(nodes) {
  const main = computeMainLayout(nodes)
  const sidebar = computeSidebarLayout(nodes)
  const floating = computeFloatingLayout(nodes)

  const map = new Map()

  ;[...main, ...sidebar, ...floating].forEach(n => {
    map.set(n.id, n)
  })

  return Array.from(map.values())
}