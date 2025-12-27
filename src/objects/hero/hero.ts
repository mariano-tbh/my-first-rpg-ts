import { Resource } from "../../constants/resources";
import { level1Walls } from "../../levels/level-1";
import { Animations } from "../../lib/classes/animations";
import { Renderable, type RenderableInit, type RenderContext, } from "../../lib/classes/renderable";
import type { Direction } from "../../lib/classes/input";
import { SpriteResource, } from "../../lib/classes/resource";
import { Sprite } from "../../lib/classes/sprite";
import { Vector2D } from "../../lib/classes/vector";
import { grid, isWallCell } from "../../lib/utils/grid-utils";
import { pick_up, stand_down, stand_left, stand_right, stand_up, walk_down, walk_left, walk_right, walk_up } from "./hero-animations";

export type HeroInit = RenderableInit & {
  // Additional properties can be added here in the future
  initialDirection?: Direction;
  initialSpeed?: number;
}

declare global {
  type HeroEvents = {
    on_position_change: [position: Vector2D]
    on_item_pickup: [image: string, position: Vector2D]
  }

  interface EventsMap extends HeroEvents { }
}

export class HeroModel extends Renderable {
  readonly #heroSprite
  readonly #shadowSprite

  #lastDirection
  #destination
  #speed
  #lockTime = 0
  #itemShell: Renderable | null = null

  constructor(init: HeroInit) {
    super({
      name: 'hero.model',
      position: init.position
    });

    this.#shadowSprite = new Sprite({
      name: 'hero.shadow',
      resource: new SpriteResource({ src: Resource.shadow }),
      frameSize: new Vector2D(grid(2), grid(2)),
      position: new Vector2D(-8, -19),
    })
    this.addChild(this.#shadowSprite);

    this.#heroSprite = new Sprite({
      name: 'hero.sprite',
      resource: new SpriteResource({ src: Resource.hero }),
      horizontalFrames: 3,
      verticalFrames: 8,
      frame: 1,
      frameSize: new Vector2D(grid(2), grid(2)),
      position: new Vector2D(-8, -20),
      animations: new Animations({
        walk_down,
        walk_up,
        walk_left,
        walk_right,
        stand_down,
        stand_up,
        stand_left,
        stand_right,
        pick_up,
      })
    })
    this.addChild(this.#heroSprite);

    this.#lastDirection = init.initialDirection ?? 'down';
    this.#destination = this.position.clone();
    this.#speed = init.initialSpeed ?? 1;
  }

  onReady(): void {
    this.events.subscribe('on_item_pickup', this, (image, position) => {
      this.#handleItemPickup(image, position);
    });
  }

  onStep(deltaTime: number, context: RenderContext): void {
    if (this.#lockTime > 0) {
      this.#pickUpItem(deltaTime);
      return;
    }

    const { magnitude } = this.moveTowards(this.#destination, this.#speed);
    const hasArrived = magnitude <= 1
    if (hasArrived) {
      this.#tryMove(context);
    }
  }

  #tryMove({ input }: RenderContext) {
    if (!input.direction) {
      if (this.#lastDirection === 'down') this.#heroSprite.animations.play('stand_down');
      else if (this.#lastDirection === 'up') this.#heroSprite.animations.play('stand_up');
      else if (this.#lastDirection === 'left') this.#heroSprite.animations.play('stand_left');
      else if (this.#lastDirection === 'right') this.#heroSprite.animations.play('stand_right');
      return;
    }

    this.#lastDirection = input.direction;

    let next = this.#destination.clone();

    if (input.direction === 'down') {
      next = next.add(0, grid(1));
      this.#heroSprite.animations.play('walk_down');
    } else if (input.direction === 'up') {
      next = next.add(0, -grid(1));
      this.#heroSprite.animations.play('walk_up');
    } else if (input.direction === 'left') {
      next = next.add(-grid(1), 0);
      this.#heroSprite.animations.play('walk_left');
    } else if (input.direction === 'right') {
      next = next.add(grid(1), 0);
      this.#heroSprite.animations.play('walk_right');
    }

    if (!isWallCell(level1Walls, next)) {
      this.#destination = next;
      this.events.publish('on_position_change', next);
    }
  }

  #pickUpItem(deltaTime: number) {
    this.#lockTime = Math.max(0, this.#lockTime - deltaTime);
    this.#heroSprite.animations.play('pick_up');
    if (this.#lockTime === 0 && this.#itemShell) {
      this.#itemShell.destroy()
      this.#itemShell = null;
    }
  }

  #handleItemPickup(image: string, position: Vector2D) {
    this.#destination = position.clone();
    this.#lockTime = 1000;

    this.#itemShell = new Sprite({
      resource: new SpriteResource({ src: image }),
      frameSize: new Vector2D(grid(1), grid(1)),
      position: new Vector2D(0, -24),
    });
    this.addChild(this.#itemShell);
  }
}