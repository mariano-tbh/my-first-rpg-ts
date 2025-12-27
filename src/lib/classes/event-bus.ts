export type Unsubscribe = () => void;

declare global {
  interface EventsMap {
    [key: string]: any[];
  }
}

export type EventKey = keyof EventsMap & string;

export type Subscription = {
  subject: object
  callback: (...args: any[]) => void;
}

export class EventBus {
  readonly #subs: Map<EventKey, Set<Subscription>>;

  constructor() {
    this.#subs = new Map();
  }

  subscribe<K extends EventKey>(
    event: K,
    subject: object,
    callback: (...args: EventsMap[K]) => void
  ): Unsubscribe {
    let listeners = this.#subs.get(event);

    if (!listeners) {
      listeners = new Set();
      this.#subs.set(event, listeners);
    }

    const sub: Subscription = { subject, callback }

    listeners.add(sub);

    return () => {
      listeners?.delete(sub);
    }
  }

  publish<K extends EventKey>(
    event: K,
    ...args: EventsMap[K]
  ) {
    const subs = this.#subs.get(event);
    if (!subs) return;
    for (const sub of subs) {
      sub.callback(...args);
    }
  }

  flush(target: object) {
    for (const subs of this.#subs.values()) {
      for (const sub of subs) {
        if (sub.subject === target) {
          subs.delete(sub);
        }
      }
    }
  }

  flushAll() {
    this.#subs.clear();
  }
}