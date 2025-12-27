export type Direction = 'up' | 'down' | 'left' | 'right';

export class InputListener {
  readonly #pressedKeys = Array<Direction>();

  constructor() {
    document.addEventListener('keydown', (event) => {
      const direction = mapKeyCodeToDirection(event.code);
      if (!direction) return;
      this.#handleKeyDown(direction);
    });
    document.addEventListener('keyup', (event) => {
      const direction = mapKeyCodeToDirection(event.code);
      if (!direction) return;
      this.#handleKeyUp(direction);
    });
  }

  get direction() {
    return this.#pressedKeys[0] ?? null;
  }

  get pressedKeys() {
    return [...this.#pressedKeys];
  }

  #handleKeyDown(direction: Direction) {
    if (this.#pressedKeys.includes(direction)) return
    this.#pressedKeys.unshift(direction);
  }

  #handleKeyUp(direction: Direction) {
    const index = this.#pressedKeys.indexOf(direction);
    if (index !== -1) {
      this.#pressedKeys.splice(index, 1);
    }
  }
}

function mapKeyCodeToDirection(code: string): Direction | null {
  switch (code) {
    case 'ArrowUp':
    case 'KeyW':
      return 'up';
    case 'ArrowDown':
    case 'KeyS':
      return 'down';
    case 'ArrowLeft':
    case 'KeyA':
      return 'left';
    case 'ArrowRight':
    case 'KeyD':
      return 'right';
    default:
      return null;
  }
}