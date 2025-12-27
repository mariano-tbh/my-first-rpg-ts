import type { Vector2D } from "../classes/vector";
import type { CoordinateKey, WallSet } from "../types/wall-set";

/**
 * 
 * @param number 
 * @param cellSize 
 * @returns 
 */
export function grid(number: number = 1, cellSize: number = 16) {
  return (number * cellSize);
}

export const toCoordinateKey = (x: number, y: number): CoordinateKey => {
  return `${x},${y}`;
}

export function isWallCell(walls: WallSet, vector: Vector2D): boolean {
  const key = toCoordinateKey(vector.x, vector.y);
  return walls.has(key);
}