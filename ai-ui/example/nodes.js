export const nodes = {
  task1: {
    id: "task1",
    type: "task",
    layout: {
      zone: "main",
      size: "medium",
      priority: 10
    }
  },

  task2: {
    id: "task2",
    type: "task",
    layout: {
      zone: "main",
      size: "small",
      priority: 5
    }
  },

  sidebarHome: {
    id: "sidebarHome",
    type: "nav",
    layout: {
      zone: "sidebar"
    }
  },

  floatingNotice: {
    id: "floatingNotice",
    type: "notice",
    layout: {
      zone: "floating",
      size: "small"
    }
  }
}