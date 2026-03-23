const GAP = 12
const PADDING_TOP = 20
const PADDING_LEFT = 20

const widthMap = {
  small: 260,
  medium: 320,
  large: 420
}

const heightMap = {
  small: 90,
  medium: 110,
  large: 150
}

function normalize(node) {
  const size = node.layout?.size || "medium"

  let width = node.layout?.width || widthMap[size]
  let height = node.layout?.height || heightMap[size]

  // safety clamp
  width = Math.max(200, width || 320)
  height = Math.max(60, height || 110)

  return { ...node, size, width, height }
}

export function computeLayout(nodes) {
  let y = PADDING_TOP

  return Object.values(nodes)
    .map(normalize)
    .sort((a, b) => (b.layout?.priority || 0) - (a.layout?.priority || 0))
    .map(node => {
      const layout = {
        top: y,
        left: PADDING_LEFT,
        width: node.width,
        height: node.height,
        size: node.size
      }

      y += node.height + GAP

      return {
        ...node,
        layout
      }
    })
}