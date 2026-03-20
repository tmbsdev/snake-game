import { Direction, Position } from "./types";

export const GRID_SIZE = 20;
export const TICK_INTERVAL = 150;
export const SCORE_PER_FOOD = 10;

export function moveSnake(snake: Position[], direction: Direction): Position[] {
  const head = snake[0];
  const newHead = getNextHead(head, direction);
  return [newHead, ...snake.slice(0, -1)];
}

export function growSnake(snake: Position[], direction: Direction): Position[] {
  const head = snake[0];
  const newHead = getNextHead(head, direction);
  return [newHead, ...snake];
}

function getNextHead(head: Position, direction: Direction): Position {
  switch (direction) {
    case "UP":
      return { x: head.x, y: head.y - 1 };
    case "DOWN":
      return { x: head.x, y: head.y + 1 };
    case "LEFT":
      return { x: head.x - 1, y: head.y };
    case "RIGHT":
      return { x: head.x + 1, y: head.y };
  }
}

export function generateFood(snake: Position[], gridSize: number): Position {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const available: Position[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y });
      }
    }
  }
  if (available.length === 0) {
    return { x: 0, y: 0 };
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function checkCollision(head: Position, gridSize: number): boolean {
  return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
}

export function checkSelfCollision(snake: Position[]): boolean {
  const head = snake[0];
  return snake.slice(1).some((p) => p.x === head.x && p.y === head.y);
}

export function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === "UP" && b === "DOWN") ||
    (a === "DOWN" && b === "UP") ||
    (a === "LEFT" && b === "RIGHT") ||
    (a === "RIGHT" && b === "LEFT")
  );
}

export function createInitialSnake(gridSize: number): Position[] {
  const centerX = Math.floor(gridSize / 2);
  const centerY = Math.floor(gridSize / 2);
  return [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
}
