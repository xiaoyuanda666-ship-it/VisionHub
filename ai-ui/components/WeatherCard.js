import { animateIn, animateOut } from "../core/animation.js"

export function WeatherCard(props, visible = true) {
  const el = document.createElement("div")

  // ===== layout control =====
  const layout = props.layout || {}
  const width = layout.width || 320
  const height = layout.height

  // ===== base style =====
  el.style.userSelect = "none"
  el.style.background = "rgba(255,255,255,0.05)"
  el.style.border = "1px solid rgba(255,255,255,0.1)"
  el.style.padding = "16px"
  el.style.borderRadius = "12px"
  el.style.backdropFilter = "blur(10px)"
  el.style.willChange = "transform, opacity"

  // 👉 layout driven width
  el.style.width = width + "px"

  // 👉 optional fixed height
  if (height) {
    el.style.height = height + "px"
    el.style.overflow = "hidden"
  }

  // init animation state
  el.style.opacity = "0"
  el.style.transform = "translateY(10px) scale(0.98)"

  // ===== header =====
  const header = document.createElement("div")
  header.style.display = "flex"
  header.style.justifyContent = "space-between"
  header.style.marginBottom = "10px"

  const city = document.createElement("div")
  city.innerText = props.city || "Unknown"
  city.style.fontSize = "14px"
  city.style.opacity = "0.7"

  const date = document.createElement("div")
  date.innerText = props.date || new Date().toLocaleDateString()
  date.style.fontSize = "12px"
  date.style.opacity = "0.6"

  header.appendChild(city)
  header.appendChild(date)

  // ===== current weather =====
  const current = document.createElement("div")
  current.style.display = "flex"
  current.style.alignItems = "center"
  current.style.marginBottom = "12px"

  const icon = document.createElement("div")
  icon.innerText = getWeatherIcon(props.desc)
  icon.style.fontSize = "36px"
  icon.style.marginRight = "10px"

  const info = document.createElement("div")

  const temp = document.createElement("div")
  temp.innerText = (props.temp ?? "--") + "°C"
  temp.style.fontSize = "28px"
  temp.style.fontWeight = "bold"

  const desc = document.createElement("div")
  desc.innerText = props.desc || ""
  desc.style.fontSize = "14px"
  desc.style.opacity = "0.8"

  info.appendChild(temp)
  info.appendChild(desc)

  current.appendChild(icon)
  current.appendChild(info)

  // ===== extra info =====
  const extra = document.createElement("div")
  extra.style.fontSize = "12px"
  extra.style.opacity = "0.6"
  extra.style.marginBottom = "12px"

  const extraText = []
  if (props.humidity) extraText.push("Humidity " + props.humidity + "%")
  if (props.wind) extraText.push("Wind " + props.wind)

  extra.innerText = extraText.join(" · ")

  // ===== forecast =====
  const forecast = document.createElement("div")
  forecast.style.display = "flex"
  forecast.style.justifyContent = "space-between"

  const days = props.forecast || []

  days.slice(0, 3).forEach(day => {
    const item = document.createElement("div")
    item.style.textAlign = "center"
    item.style.flex = "1"

    const d = document.createElement("div")
    d.innerText = day.day
    d.style.fontSize = "12px"
    d.style.opacity = "0.6"

    const ic = document.createElement("div")
    ic.innerText = getWeatherIcon(day.desc)
    ic.style.fontSize = "20px"
    ic.style.margin = "4px 0"

    const t = document.createElement("div")
    t.innerText = day.temp + "°"
    t.style.fontSize = "12px"

    item.appendChild(d)
    item.appendChild(ic)
    item.appendChild(t)

    forecast.appendChild(item)
  })

  // ===== assemble =====
  el.appendChild(header)
  el.appendChild(current)
  el.appendChild(extra)
  el.appendChild(forecast)

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

// ===== icon mapping =====
function getWeatherIcon(desc = "") {
  desc = desc.toLowerCase()

  if (desc.includes("sun")) return "☀️"
  if (desc.includes("cloud")) return "☁️"
  if (desc.includes("rain")) return "🌧️"
  if (desc.includes("storm")) return "⛈️"
  if (desc.includes("snow")) return "❄️"

  return "🌡️"
}