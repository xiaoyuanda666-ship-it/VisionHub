const DEFAULT_DURATION = 800
const presets = {
  fadeIn: {
    from: {
      opacity: "0",
      transform: "translateY(10px) scale(0.9)"
    },
    to: {
      opacity: "1",
      transform: "translateY(0) scale(1)"
    },
    duration: DEFAULT_DURATION
  },

  drawer: {
    from: {
      height: "0px",
      opacity: "0"
    },
    to: {
      height: "auto",
      opacity: "1"
    },
    duration: DEFAULT_DURATION
  },

  zoomIn: {
    from: {
      opacity: "0",
      transform: "scale(0.6)"
    },
    to: {
      opacity: "1",
      transform: "scale(1)"
    },
    duration: DEFAULT_DURATION
  }
}

function applyStyles(el, styles) {
  for (const k in styles) {
    el.style[k] = styles[k]
  }
}

export function animateIn(el, type = "fadeIn") {
  const preset = presets[type] || presets.fadeIn

  // 1. 强制设置初始状态（关键）
  applyStyles(el, preset.from)

  el.style.transition = "none"

  // 2. 强制浏览器“吃掉第一帧”
  void el.offsetWidth

  // 3. 再开启动画
  el.style.transition = `all ${preset.duration}ms ease`
  el.style.willChange = "transform, opacity, height"

  requestAnimationFrame(() => {
    applyStyles(el, preset.to)
  })
}

export function animateOut(el, type = "fadeIn", done) {
  const preset = presets[type] || presets.fadeIn

  applyStyles(el, preset.to)

  el.style.transition = `all ${preset.duration}ms ease`

  requestAnimationFrame(() => {
    applyStyles(el, preset.from)
  })

  setTimeout(() => {
    done && done()
  }, preset.duration)
}