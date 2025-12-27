import { Resource } from "../../constants/resources";
import { Renderable, type RenderableInit } from "../../lib/classes/renderable";
import { SpriteResource } from "../../lib/classes/resource";
import { Sprite } from "../../lib/classes/sprite";
import { Vector2D } from "../../lib/classes/vector";
import type { HeroModel } from "../hero/hero";

export type RodInit = RenderableInit & {
  // Additional properties can be added here in the future
  target: HeroModel
}

export class RodModel extends Renderable {
  readonly #sprite

  constructor(init: RodInit) {
    super({
      name: 'rod.model',
      position: init.position
    });

    this.#sprite = new Sprite({
      name: 'rod.sprite',
      resource: new SpriteResource({ src: Resource.rod }),
      position: new Vector2D(0, -5),
    })
    this.addChild(this.#sprite);
  }

  onReady() {
    this.events.subscribe('on_position_change', this, (position) => {
      if (this.position.collides(position, 0)) {
        this.#handleCollision();
      }
    });
  }

  #handleCollision() {
    this.destroy();
    this.events.publish('on_item_pickup', Resource.rod, this.position);
  }
}