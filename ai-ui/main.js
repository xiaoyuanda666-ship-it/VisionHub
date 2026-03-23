import { handleCommand } from "./core/command.js"
import "./core/debug.js"

setTimeout(() => {
  handleCommand({
    agent: "assistant",
    action: "create",
    type: "webpage",
    props: {
      title: "GitHub Trending",
      host: "github.com",
      url: "https://github.com/trending",
      description: "See what developers are building right now.",
      image: "https://opengraph.githubassets.com/1/trending",
      duration: 6000,

      layout: {
        zone: "main",
        width: 420,
        height: 180,
        priority: 5,
        size: "large"
      }
    }
  })
}, 1000)

setTimeout(() => {
  handleCommand({
    agent: "weather",
    action: "create",
    type: "weather",
    props: {
      city: "Singapore",
      date: "Mar 23",
      temp: 31,
      desc: "Cloudy",
      humidity: 78,
      wind: "10 km/h",
      forecast: [
        { day: "Tue", temp: 30, desc: "Rain" },
        { day: "Wed", temp: 32, desc: "Sunny" },
        { day: "Thu", temp: 29, desc: "Cloudy" }
      ],

      layout: {
        zone: "main",
        width: 320,
        height: 240,
        priority: 10,
        size: "medium"
      }
    }
  })
}, 1500)