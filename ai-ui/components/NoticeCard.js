import { animateIn, animateOut } from "../core/animation.js"

export function NoticeCard(props, visible = true) {
  const el = document.createElement("div")

  // ===== 和 WeatherCard 统一：不写死 width =====
  el.style.boxSizing = "border-box"
  el.style.userSelect = "none"

  // 让宽度跟随布局（关键）
  el.style.width = "100%"

  // ===== 外观 =====
  el.style.background = "rgba(255,255,255,0.05)"
  el.style.padding = "10px"
  el.style.borderRadius = "8px"
  el.style.border = "1px solid rgba(255,255,255,0.1)"
  el.style.backdropFilter = "blur(10px)"

  // 交给外部 layout 控制间距
  el.style.marginBottom = "0px"

  // ===== 动画（和 WeatherCard 同系统）=====
  el.style.willChange = "transform, opacity"

  // 初始状态
  el.style.opacity = "0"
  el.style.transform = "translateY(10px) scale(0.98)"

  // ===== 内容 =====
  const title = document.createElement("div")
  title.innerText = props.title || "Notice"
  title.style.fontSize = "14px"
  title.style.opacity = "0.9"
  title.style.marginBottom = "6px"

  const text = document.createElement("div")
  text.innerText = props.text || ""
  text.style.fontSize = "12px"
  text.style.opacity = "0.7"
  text.style.lineHeight = "1.4"

  el.appendChild(title)
  el.appendChild(text)

  // ===== 生命周期动画（统一 animate.js）=====
  const enter = () => {
    el.style.opacity = "0"
    el.style.transform = "translateY(10px) scale(0.98)"

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