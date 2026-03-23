import { NoticeCard } from "../components/NoticeCard.js"
import { WeatherCard } from "../components/WeatherCard.js"
import { WebPageCard } from "../components/WebPageCard.js"
import { computeLayout } from "./layout.js"

const componentMap = {
  notice: NoticeCard,
  weather: WeatherCard,
  webpage: WebPageCard
}

export function render(store) {
  const app = document.getElementById("app")

  const layouts = computeLayout(store.nodes)

  layouts.forEach(node => {
    let el = document.getElementById(node.id)

    // 👉 必须用最新 layout
    const layout = node.layout

    if (!el) {
      const Comp = componentMap[node.type]

      if (!Comp) return

      el = Comp(node.props, node.visible)
      el.id = node.id

      el.style.position = "absolute"
      app.appendChild(el)
    }

    // ===== 强制使用最新 layout =====
    el.style.top = layout.top + "px"
    el.style.left = layout.left + "px"
    el.style.width = layout.width + "px"

    // ===== 防止 CSS 干扰 =====
    el.style.margin = "0"

    // ===== visibility update =====
    if (node.visible === false && el.lifecycle) {
      el.lifecycle.exit(() => el.remove())
    }
  })
}