import { EventEmitter } from "events"

class EventBus extends EventEmitter {
  emitEvent(type, data) {
    this.emit(type, data)
  }

  onEvent(type, handler) {
    this.on(type, handler)
  }
}

export const eventBus = new EventBus()