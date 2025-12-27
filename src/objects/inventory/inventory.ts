import { Resource } from "../../constants/resources";
import { Renderable } from "../../lib/classes/renderable";
import { SpriteResource } from "../../lib/classes/resource";
import { Sprite } from "../../lib/classes/sprite";
import { Vector2D } from "../../lib/classes/vector";
import { grid } from "../../lib/utils/grid-utils";

export type InventoryItem = {
  id: string;
  image: string;
};

export class Inventory extends Renderable {
  readonly #items: InventoryItem[] = [
    { id: 'rod-1', image: Resource.rod },
    { id: 'rod-2', image: Resource.rod },
  ]

  constructor() {
    super({
      name: 'inventory',
    });


    this.events.subscribe('on_item_pickup', this, (image, _position) => {
      this.#items.push({ id: crypto.randomUUID(), image });
      this.#renderInventory();
    });

    this.#renderInventory();
  }

  removeItem(itemId: string) {
    const index = this.#items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.#items.splice(index, 1);
      this.#renderInventory();
    }
  }

  #renderInventory() {
    this.destroyChildren();

    for (const [index, item] of this.#items.entries()) {
      const sprite = new Sprite({
        name: 'inventory.sprite',
        resource: new SpriteResource({ src: item.image }),
        position: new Vector2D(grid(index), 2),
      })
      this.addChild(sprite);
    }
  }
}