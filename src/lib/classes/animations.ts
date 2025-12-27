import type { FrameIndexPattern } from "./frame-index-pattern";

export class Animations<T extends Record<string, FrameIndexPattern>> {
  readonly #animations: T;

  #activeKey: keyof T;

  constructor(animations: T) {
    this.#animations = animations;

    const keys = Object.keys(animations)
    if (keys.length === 0) {
      throw new Error('Animations cannot be empty');
    }

    this.#activeKey = keys[0] as keyof T;
  }

  get frame() {
    return this.#animations[this.#activeKey].frame;
  }

  step(deltaTime: number) {
    this.#animations[this.#activeKey].step(deltaTime);
  }

  play(key: keyof T, startAt: number = 0) {
    if (this.#activeKey === key) {
      return this
    }

    this.#activeKey = key;
    this.#animations[this.#activeKey].reset(startAt);
    return this;
  }
}