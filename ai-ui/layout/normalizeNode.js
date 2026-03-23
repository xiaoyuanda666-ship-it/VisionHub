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

export function normalizeNode(node) {
  const size = node.layout?.size || "medium"

  let width = node.layout?.width || widthMap[size]
  let height = node.layout?.height || heightMap[size]

  width = Math.max(200, width || 320)
  height = Math.max(60, height || 110)

  return {
    ...node,
    layout: {
      ...node.layout,
      size,
      width,
      height,
      zone: node.layout?.zone || "main",
      priority: node.layout?.priority || 0
    }
  }
}