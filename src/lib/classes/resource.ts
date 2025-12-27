export type ResourceInstance = {
  image: HTMLImageElement;
  isLoaded: boolean;
};

export type SpriteResourceInit = {
  src: string;
};

export class SpriteResource {
  readonly #image: HTMLImageElement;
  #isLoaded: boolean;

  constructor(init: SpriteResourceInit) {
    this.#image = new Image();
    this.#image.src = init.src;
    this.#isLoaded = false;
    this.#image.addEventListener('load', () => {
      this.#isLoaded = true;
    }, { once: true });
  }

  get image() {
    return this.#image;
  }

  get isLoaded() {
    return this.#isLoaded;
  }
}
