import { grid } from "../utils/grid-utils";
import type { Animations } from "./animations";
import { Renderable, type RenderableInit } from "./renderable";
import type { SpriteResource } from "./resource";
import { Vector2D } from "./vector";

export type SpriteInit<TAnimations extends Animations<any> | undefined = undefined> =
  Partial<RenderableInit> &
  {
    /**
     * The image resource for the sprite.
     */
    resource: SpriteResource;
    /**
     * The size of each frame in the sprite sheet.
     */
    frameSize?: Vector2D;
    /**
     * Sprite size
     */
    size?: Vector2D;
    /**
     * Length of the sprite horizontally
     */
    horizontalFrames?: number;
    /**
     * Length of the sprite vertically
     */
    verticalFrames?: number;
    /**
     * which frame we want to show
     */
    frame?: number;
    /**
     * scaling factor for the sprite
     */
    scale?: number;
    /**
     * Animations associated with the sprite
     */
    animations?: TAnimations
  };


export class Sprite<TAnimations extends Animations<any> = Animations<any>> extends Renderable {
  readonly #resource
  readonly #frameSize
  readonly #horizontalFrames
  readonly #verticalFrames
  readonly #scale
  readonly #frameMap;
  readonly #animations: TAnimations;

  #frame
  #position

  constructor(init: SpriteInit<TAnimations>) {
    super({
      name: init.name ?? 'sprite',
      position: init.position ?? Vector2D.default()
    });
    this.#resource = init.resource;
    this.#frameSize = init.frameSize ?? new Vector2D(grid(1), grid(1));
    this.#horizontalFrames = init.horizontalFrames ?? 1;
    this.#verticalFrames = init.verticalFrames ?? 1;
    this.#frame = init.frame ?? 0;
    this.#scale = init.scale ?? 1;
    this.#position = init.position ?? Vector2D.default();
    this.#frameMap = new Map<number, Vector2D>();
    this.#animations = init.animations as TAnimations;
    this.#initFrameMap();
  }

  get resource() {
    return this.#resource;
  }
  get position() {
    return this.#position;
  }
  set frame(frame: number) {
    if (!this.#frameMap.has(frame)) {
      throw new Error(`Frame ${frame} does not exist in the sprite sheet.`);
    }

    this.#frame = frame;
  }
  get animations() {
    return this.#animations;
  }

  onDraw(ctx: CanvasRenderingContext2D, position?: Vector2D) {
    if (!this.#resource.isLoaded) {
      return;
    }

    const coords = this.#frameMap.get(this.#frame) ?? Vector2D.default();

    if (position) {
      this.#position = position.clone();
    }

    ctx.drawImage(
      this.#resource.image,
      coords.x,
      coords.y,
      this.#frameSize.x,
      this.#frameSize.y,
      this.#position.x,
      this.#position.y,
      this.#frameSize.x * this.#scale,
      this.#frameSize.y * this.#scale,
    )
  }

  onStep(deltaTime: number) {
    if (!this.#animations) {
      return;
    }

    this.#animations.step(deltaTime);
    this.frame = this.#animations.frame;
  }

  #initFrameMap() {
    let frameCount = 0
    for (let v = 0; v < this.#verticalFrames; v++) {
      for (let h = 0; h < this.#horizontalFrames; h++) {
        this.#frameMap.set(frameCount, new Vector2D(this.#frameSize.x * h, this.#frameSize.y * v));
        frameCount++;
      }
    }
  }
}