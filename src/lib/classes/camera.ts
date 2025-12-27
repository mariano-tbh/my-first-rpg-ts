import { Renderable } from "./renderable";
import { Vector2D } from "./vector";

export type CameraInit = {
  target: Renderable;
  targetSize: Vector2D;
  canvasHeight: number;
  canvasWidth: number;
};

export class Camera extends Renderable {
  readonly #canvasWidth: number;
  readonly #canvasHeight: number;

  #zoomLevel: number;
  #target: Renderable
  #targetSize: Vector2D;

  constructor(init: CameraInit) {
    super({
      name: 'camera',
      position: init.target.position
    });
    this.#target = init.target;
    this.#targetSize = init.targetSize;
    this.#zoomLevel = 1;
    this.#canvasWidth = init.canvasWidth;
    this.#canvasHeight = init.canvasHeight;
  }

  override get position() {
    const targetPos = this.#target.position;
    const halfTargetSize = this.#targetSize.x / 2;
    const halfCanvasWidth = -halfTargetSize + this.#canvasWidth / (2 * this.#zoomLevel);
    const halfCanvasHeight = -halfTargetSize + this.#canvasHeight / (2 * this.#zoomLevel);
    return new Vector2D(
      -targetPos.x + halfCanvasWidth - 25,
      -targetPos.y + halfCanvasHeight - 15
    );
  }

  follow(target: Renderable, size: Vector2D) {
    this.#target = target;
    this.#targetSize = size;
    return this;
  }

  zoom(level: number) {
    this.#zoomLevel = level;
    return this;
  }
}