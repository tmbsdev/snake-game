export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type Position = {
  x: number;
  y: number;
};

export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

export type GameMode = "classic" | "wrap"; // classic = wall kills, wrap = pass through

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  inputQueue: Direction[];
  status: GameStatus;
  mode: GameMode;
  score: number;
  highScore: number;      // classic mode best
  highScoreWrap: number;  // wrap mode best
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
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "SET_HIGH_SCORE"; highScore: number; highScoreWrap: number };
