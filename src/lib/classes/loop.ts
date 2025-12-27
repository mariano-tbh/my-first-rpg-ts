export type LoopInit = {
  update: (number: number) => void;
  render: () => void;
};

export class Loop {
  readonly #update;
  readonly #render;

  #lastFrameTime;
  #accumulatedTime;
  #frameRate
  #frameId;
  #isRunning

  constructor(init: LoopInit) {
    this.#lastFrameTime = 0;
    this.#accumulatedTime = 0;
    this.#frameRate = 1000 / 60; // 60 FPS
    this.#isRunning = false;
    this.#update = init.update;
    this.#render = init.render;
    this.#frameId = null as number | null;
  }

  start() {
    if (this.#isRunning) {
      return;
    }

    this.#isRunning = true;
    this.#frameId = requestAnimationFrame(this.#loop);
  }


  cancel() {
    if (this.#frameId !== null) {
      cancelAnimationFrame(this.#frameId);
    }

    this.#isRunning = false;
  }

  #loop: FrameRequestCallback = (time) => {
    if (!this.#isRunning) {
      return
    }

    const deltaTime = time - this.#lastFrameTime;
    this.#lastFrameTime = time;
    this.#accumulatedTime += deltaTime;

    while (this.#accumulatedTime >= this.#frameRate) {
      this.#update(this.#frameRate);
      this.#accumulatedTime -= this.#frameRate;
    }

    this.#render();

    this.#frameId = requestAnimationFrame(this.#loop);
  }

}