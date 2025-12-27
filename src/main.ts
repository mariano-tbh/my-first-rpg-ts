import { Loop } from "./lib/classes/loop";
import { SpriteResource } from "./lib/classes/resource";
import { Sprite } from "./lib/classes/sprite";
import { Vector2D } from "./lib/classes/vector";
import { Resource } from "./constants/resources";
import { Renderable } from "./lib/classes/renderable";
import { HeroModel } from "./objects/hero/hero";
import { grid } from "./lib/utils/grid-utils";
import { InputListener } from "./lib/classes/input";
import { Camera } from "./lib/classes/camera";
import { RodModel } from "./objects/rod/rod";
import { Inventory } from "./objects/inventory/inventory";

const canvas = document.getElementById('my-first-rpg') as HTMLCanvasElement;
canvas.width = 320;
canvas.height = 180;
const ctx = canvas.getContext('2d')!;

const input = new InputListener()

const mainScene = new Renderable({
  name: 'main.scene',
  position: new Vector2D(0, 0)
});
const inventory = new Inventory()
const skySprite = new Sprite({
  name: 'sky.sprite',
  resource: new SpriteResource({ src: Resource.sky }),
  frameSize: new Vector2D(canvas.width, canvas.height),
})
const groundSprite = new Sprite({
  name: 'ground.sprite',
  resource: new SpriteResource({ src: Resource.ground }),
  frameSize: new Vector2D(canvas.width, canvas.height),
})
mainScene.addChild(groundSprite)

const hero = new HeroModel({ position: new Vector2D(grid(6), grid(5)) });
mainScene.addChild(hero);

const rod = new RodModel({ position: new Vector2D(grid(7), grid(6)), target: hero });
mainScene.addChild(rod);

const camera = new Camera({
  target: hero,
  targetSize: new Vector2D(grid(1), grid(1)),
  canvasWidth: canvas.width,
  canvasHeight: canvas.height,
});
mainScene.addChild(camera);

const gameLoop = new Loop({
  update: (deltaTime) => {
    mainScene.step(deltaTime, { input });
  },
  render: () => {
    const { position } = camera
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    skySprite.draw(ctx);
    ctx.save();
    ctx.translate(position.x, position.y);
    mainScene.draw(ctx);
    ctx.restore();
    // hud
    inventory.draw(ctx);
  },
})

gameLoop.start();
