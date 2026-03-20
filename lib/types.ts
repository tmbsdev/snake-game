export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type Position = {
  x: number;
  y: number;
};

export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  inputQueue: Direction[];
  status: GameStatus;
  score: number;
  highScore: number;
  gridSize: number;
  tickInterval: number;
};

export type GameAction =
  | { type: "TICK" }
  | { type: "CHANGE_DIRECTION"; direction: Direction }
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESTART" }
  | { type: "SET_HIGH_SCORE"; highScore: number };
