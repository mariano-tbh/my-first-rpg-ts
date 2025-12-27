
export type FrameIndexPatternInit = {

  duration: number;
  frames: SpriteAnimationFrame[];
};

export type SpriteAnimationFrame = {
  startAt: number;
  frame: number;
};

export class FrameIndexPattern {
  readonly #duration: number;
  readonly #frames: SpriteAnimationFrame[];

  #currentTime: number;

  constructor(init: FrameIndexPatternInit) {
    this.#currentTime = 0;
    this.#duration = init.duration;
    this.#frames = init.frames;
  }

  get frame() {
    const frames = this.#frames;
    for (let i = frames.length - 1; i >= 0; i--) {
      if (this.#currentTime >= frames[i].startAt) {
        return frames[i].frame;
      }
    }
    throw new Error('No frame found for current time: ' + this.#currentTime);
  }

  reset(startAt: number = 0) {
    this.#currentTime = startAt;
  }

  step(deltaTime: number) {
    this.#currentTime += deltaTime;
    if (this.#currentTime >= this.#duration) {
      this.#currentTime = 0;
    }
  }
}