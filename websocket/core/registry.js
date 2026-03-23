export class Registry {
  constructor() {
    this.map = new Map()
  }

  register(id, info) {
    this.map.set(id, {
      id,
      ...info,
      createdAt: Date.now()
    })
  }

  remove(id) {
    this.map.delete(id)
  }

  get(id) {
    return this.map.get(id)
  }

  list() {
    return Array.from(this.map.values())
  }
}

export const registry = new Registry()