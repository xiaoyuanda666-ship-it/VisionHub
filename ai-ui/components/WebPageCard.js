import { animateIn, animateOut } from "../core/animation.js"

export function WebPageCard(props, visible = true) {
  const el = document.createElement("div")

  const layout = props.layout || {}
  const width = layout.width || 320
  const height = layout.height // 可以没有，高度让内容撑

  // ===== base style =====
  el.style.userSelect = "none"
  el.style.background = "rgba(255,255,255,0.05)"
  el.style.border = "1px solid rgba(255,255,255,0.1)"
  el.style.padding = "14px"
  el.style.borderRadius = "12px"
  el.style.marginBottom = "0px"
  el.style.backdropFilter = "blur(10px)"
  el.style.willChange = "transform, opacity"

  // 👉 关键：完全由 layout 控制宽度
  el.style.width = width + "px"

  // 👉 如果外部强制高度，就锁住，否则自适应
  if (height) {
    el.style.height = height + "px"
    el.style.overflow = "hidden"
  }

  // init state
  el.style.opacity = "0"
  el.style.transform = "translateY(10px) scale(0.98)"

  // ===== header =====
  const header = document.createElement("div")
  header.style.display = "flex"
  header.style.justifyContent = "space-between"
  header.style.marginBottom = "10px"

  const title = document.createElement("div")
  title.innerText = props.title || "Untitled Page"
  title.style.fontSize = "14px"
  title.style.opacity = "0.85"
  title.style.fontWeight = "bold"

  const host = document.createElement("div")
  host.innerText = props.host || ""
  host.style.fontSize = "12px"
  host.style.opacity = "0.5"

  header.appendChild(title)
  header.appendChild(host)

  // ===== preview =====
  const preview = document.createElement("div")
  preview.innerText = props.description || "No preview available..."
  preview.style.fontSize = "12px"
  preview.style.opacity = "0.7"
  preview.style.lineHeight = "1.4"
  preview.style.marginBottom = "10px"

  // ===== url =====
  const url = document.createElement("div")
  url.innerText = props.url || ""
  url.style.fontSize = "11px"
  url.style.opacity = "0.4"
  url.style.overflow = "hidden"
  url.style.textOverflow = "ellipsis"
  url.style.whiteSpace = "nowrap"

  // ===== image =====
  let img
  if (props.image) {
    img = document.createElement("img")
    img.src = props.image
    img.style.width = "100%"

    // 👉 不再写死120px，而是跟随布局高度
    img.style.maxHeight = "160px"
    img.style.objectFit = "cover"
    img.style.borderRadius = "8px"
    img.style.marginBottom = "10px"

    el.appendChild(img)
  }

  // ===== assemble =====
  el.appendChild(header)
  el.appendChild(preview)
  el.appendChild(url)

  // ===== animation =====
  const enter = () => {
    el.style.opacity = "0"
    el.style.transform = "translateY(10px) scale(0.5)"

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animateIn(el, "fadeIn")
      })
    })
  }

  const exit = (done) => {
    animateOut(el, "fadeIn", done)
  }

  el.lifecycle = { enter, exit }

  if (visible) enter()

  return el
}