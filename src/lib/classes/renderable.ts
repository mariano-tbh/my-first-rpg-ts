import { EventBus } from "./event-bus";
import type { InputListener } from "./input";
import { Vector2D } from "./vector";

export type RenderableInit = {
  position?: Vector2D;
  name?: string;
  children?: Renderable[];
};

export type RenderContext = {
  input: InputListener
}

let currentId = 0;

export class Renderable {
  static readonly #events = new EventBus();

  readonly #children: Renderable[];

  #name: string;
  #position: Vector2D;
  #parent: Renderable | null = null;
  #isReady = false;

  constructor(init: RenderableInit) {
    this.#position = init.position ?? Vector2D.default();
    this.#name = init.name ?? ("no-name-" + currentId++);
    this.#children = init.children ?? [];
  }

  get name() {
    return this.#name;
  }
  get parent() {
    return this.#parent;
  }
  get events() {
    return Renderable.#events;
  }
  set parent(parent: Renderable | null) {
    this.#parent = parent;
  }
  get position() {
    return this.#position;
  }
  get isReady() {
    return this.#isReady;
  }

  step(deltaTime: number, ctx: RenderContext) {
    for (const child of this.#children) {
      child.step(deltaTime, ctx);
    }

    if (!this.isReady) {
      this.#isReady = true;
      this.onReady();
    }

    this.onStep(deltaTime, ctx);
  }

  draw(ctx: CanvasRenderingContext2D, position: Vector2D = Vector2D.default()) {
    const drawPosition = this.#position.add(position);

    this.onDraw(ctx, drawPosition);

    for (const child of this.#children) {
      child.draw(ctx, drawPosition);
    }
  }

  destroy() {
    this.destroyChildren();
    this.parent?.removeChild(this);
  }

  move(delta: Vector2D) {
    this.#position = this.#position.add(delta);
    return this;
  }

  moveTo(position: Vector2D) {
    this.#position = new Vector2D(position.x, position.y);
    return this;
  }

  moveTowards(destination: Vector2D, speed: number = 1): Vector2D {
    let distance = destination.subtract(this.position);
    const magnitude = distance.magnitude;

    if (magnitude <= speed) {
      this.moveTo(destination);
    } else {
      const normalized = distance.normalize();
      const multiplied = normalized.multiply(speed);
      this.move(multiplied);

      // Recalculate remaining distance after the move
      distance = destination.subtract(this.position);
    }

    return distance;
  }

  addChild(child: Renderable) {
    child.parent = this;
    this.#children.push(child);
    return this;
  }

  removeChild(child: Renderable) {
    this.events.flush(child);
    const index = this.#children.indexOf(child);
    if (index !== -1) {
      child.parent = null;
      this.#children.splice(index, 1);
    }
  }

  destroyChildren() {
    for (const child of this.#children) {
      child.destroy();
    }
    this.#children.length = 0;
  }

  protected onStep(_deltaTime: number, _context: RenderContext): void {
    // TODO: add shared step logic here
  }

  protected onDraw(_ctx: CanvasRenderingContext2D, _position: Vector2D): void {
    // TODO: add shared draw logic here
  }

  protected onReady(): void {
    // TODO: add shared ready logic here
  }
}