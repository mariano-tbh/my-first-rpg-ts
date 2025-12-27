export class Vector2D {
  readonly #x: number;
  readonly #y: number;
  #magnitude: number | null = null;

  constructor(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  static default() {
    return new Vector2D(0, 0);
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get magnitude() {
    return this.#magnitude ??= Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(x: number, y: number): Vector2D;
  add(other: Vector2D): Vector2D;
  add(other: Vector2D | number, y?: number): Vector2D {
    if (other instanceof Vector2D) {
      return new Vector2D(this.x + other.x, this.y + other.y);
    } else if (typeof other === "number" && typeof y === "number") {
      return new Vector2D(this.x + other, this.y + y);
    }
    throw new Error("Invalid arguments for add method");
  }

  subtract(x: number, y: number): Vector2D;
  subtract(other: Vector2D): Vector2D;
  subtract(other: Vector2D | number, y?: number): Vector2D {
    if (other instanceof Vector2D) {
      return new Vector2D(this.x - other.x, this.y - other.y);
    } else if (typeof other === "number" && typeof y === "number") {
      return new Vector2D(this.x - other, this.y - y);
    }
    throw new Error("Invalid arguments for subtract method");
  }

  multiply(scalar: number): Vector2D;
  multiply(other: Vector2D): Vector2D;
  multiply(scalarOrOther: number | Vector2D): Vector2D {
    if (scalarOrOther instanceof Vector2D) {
      return new Vector2D(this.x * scalarOrOther.x, this.y * scalarOrOther.y);
    } else if (typeof scalarOrOther === "number") {
      return new Vector2D(this.x * scalarOrOther, this.y * scalarOrOther);
    }
    throw new Error("Invalid arguments for multiply method");
  }

  normalize(): Vector2D {
    const magnitude = this.magnitude;
    if (magnitude === 0) {
      return new Vector2D(0, 0);
    }
    return new Vector2D(this.x / magnitude, this.y / magnitude);
  }

  clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  collides(other: Vector2D, threshold: number): boolean {
    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);
    return (dx <= threshold) && (dy <= threshold);
  }

  valueOf() {
    return this.magnitude
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }
}