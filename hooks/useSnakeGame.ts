import { useReducer, useCallback, useEffect, useRef } from "react";
import { GameState, GameAction, GameMode, Direction } from "@/lib/types";
import { playEat, playMilestone, playGameOver, unlockAudio } from "@/lib/sounds";
import {
  GRID_SIZE,
  TICK_INTERVAL,
  SCORE_PER_FOOD,
  moveSnake,
  growSnake,
  generateFood,
  checkCollision,
  checkSelfCollision,
  isOppositeDirection,
  createInitialSnake,
  wrapPosition,
} from "@/lib/gameEngine";
import { useGameLoop } from "./useGameLoop";
import { useKeyboard } from "./useKeyboard";
import { useSwipe } from "./useSwipe";

const MAX_INPUT_QUEUE = 2;

function createInitialState(): GameState {
  const snake = createInitialSnake(GRID_SIZE);
  return {
    snake,
    food: { x: -1, y: -1 }, // hidden until game starts
    direction: "RIGHT",
    nextDirection: "RIGHT",
    inputQueue: [],
    status: "IDLE",
    mode: "classic",
    score: 0,
    highScore: 0,
    highScoreWrap: 0,
    gridSize: GRID_SIZE,
    tickInterval: TICK_INTERVAL,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TICK": {
      if (state.status !== "PLAYING") return state;

      let direction = state.direction;
      const queue = [...state.inputQueue];
      if (queue.length > 0) {
        const next = queue.shift()!;
        if (!isOppositeDirection(direction, next)) direction = next;
      }

      const head = state.snake[0];
      let nextHead = (() => {
        switch (direction) {
          case "UP":    return { x: head.x, y: head.y - 1 };
          case "DOWN":  return { x: head.x, y: head.y + 1 };
          case "LEFT":  return { x: head.x - 1, y: head.y };
          case "RIGHT": return { x: head.x + 1, y: head.y };
        }
      })();

      // Wrap mode: wrap around walls
      if (state.mode === "wrap") {
        nextHead = wrapPosition(nextHead, state.gridSize);
      }

      const eatsFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
      const newSnake = eatsFood
        ? [nextHead, ...state.snake]
        : [nextHead, ...state.snake.slice(0, -1)];

      // Classic: wall collision kills. Wrap: already wrapped, only self collision
      const wallKill = state.mode === "classic" && checkCollision(newSnake[0], state.gridSize);
      if (wallKill || checkSelfCollision(newSnake)) {
        const newHighScore = Math.max(state.score, state.highScore);
        const newHighScoreWrap = state.mode === "wrap"
          ? Math.max(state.score, state.highScoreWrap)
          : state.highScoreWrap;
        const classicHS = state.mode === "classic" ? newHighScore : state.highScore;
        playGameOver();
        return {
          ...state,
          direction,
          inputQueue: [],
          status: "GAME_OVER",
          highScore: classicHS,
          highScoreWrap: newHighScoreWrap,
        };
      }

      const newScore = eatsFood ? state.score + SCORE_PER_FOOD : state.score;
      const newFood = eatsFood ? generateFood(newSnake, state.gridSize) : state.food;

      if (eatsFood) {
        if (newScore % 100 === 0 && newScore > 0) {
          playMilestone();
        } else {
          playEat();
        }
      }

      return {
        ...state,
        snake: newSnake,
        food: newFood,
        direction,
        inputQueue: queue,
        score: newScore,
        highScore: state.mode === "classic"
          ? Math.max(newScore, state.highScore)
          : state.highScore,
        highScoreWrap: state.mode === "wrap"
          ? Math.max(newScore, state.highScoreWrap)
          : state.highScoreWrap,
      };
    }

    case "CHANGE_DIRECTION": {
      if (state.status !== "PLAYING") return state;
      const { direction } = action;
      const effectiveDir = state.inputQueue.length > 0
        ? state.inputQueue[state.inputQueue.length - 1]
        : state.direction;
      if (isOppositeDirection(effectiveDir, direction) || effectiveDir === direction) return state;
      if (state.inputQueue.length >= MAX_INPUT_QUEUE) return state;
      return { ...state, inputQueue: [...state.inputQueue, direction] };
    }

    case "SET_MODE":
      if (state.status !== "IDLE") return state;
      return { ...state, mode: action.mode };

    case "START":
      if (state.status !== "IDLE") return state;
      return {
        ...state,
        food: generateFood(state.snake, state.gridSize),
        status: "PLAYING",
      };

    case "PAUSE":
      if (state.status !== "PLAYING") return state;
      return { ...state, status: "PAUSED" };

    case "RESUME":
      if (state.status !== "PAUSED") return state;
      return { ...state, status: "PLAYING" };

    case "RESTART": {
      const snake = createInitialSnake(state.gridSize);
      return {
        ...createInitialState(),
        mode: state.mode,
        highScore: state.highScore,
        highScoreWrap: state.highScoreWrap,
        snake,
        food: generateFood(snake, state.gridSize),
        status: "PLAYING",
      };
    }

    case "SET_HIGH_SCORE":
      return { ...state, highScore: action.highScore, highScoreWrap: action.highScoreWrap };

    default:
      return state;
  }
}

export function useSnakeGame(boardRef: React.RefObject<HTMLElement | null>) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  useEffect(() => {
    const hs = parseInt(localStorage.getItem("snakeHighScore") || "0", 10);
    const hsWrap = parseInt(localStorage.getItem("snakeHighScoreWrap") || "0", 10);
    if (hs || hsWrap) dispatch({ type: "SET_HIGH_SCORE", highScore: hs, highScoreWrap: hsWrap });
  }, []);

  const prevScores = useRef({ classic: 0, wrap: 0 });
  useEffect(() => {
    if (state.highScore > prevScores.current.classic) {
      prevScores.current.classic = state.highScore;
      localStorage.setItem("snakeHighScore", String(state.highScore));
    }
    if (state.highScoreWrap > prevScores.current.wrap) {
      prevScores.current.wrap = state.highScoreWrap;
      localStorage.setItem("snakeHighScoreWrap", String(state.highScoreWrap));
    }
  }, [state.highScore, state.highScoreWrap]);

  const tick = useCallback(() => dispatch({ type: "TICK" }), []);
  useGameLoop(tick, state.tickInterval, state.status === "PLAYING");

  const handleDirection = useCallback((dir: Direction) => {
    dispatch({ type: "CHANGE_DIRECTION", direction: dir });
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  const handleSpaceBar = useCallback(() => {
    const s = stateRef.current;
    if (s.status === "IDLE") dispatch({ type: "START" });
    else if (s.status === "PLAYING") dispatch({ type: "PAUSE" });
    else if (s.status === "PAUSED") dispatch({ type: "RESUME" });
    else if (s.status === "GAME_OVER") dispatch({ type: "RESTART" });
  }, []);

  useKeyboard(handleDirection, handleSpaceBar);
  useSwipe(handleDirection, boardRef);

  useEffect(() => {
    const handler = () => unlockAudio();
    window.addEventListener("touchstart", handler, { once: true, passive: true });
    window.addEventListener("mousedown", handler, { once: true });
    return () => {
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("mousedown", handler);
    };
  }, []);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const resume = useCallback(() => dispatch({ type: "RESUME" }), []);
  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);
  const setMode = useCallback(
    (mode: GameMode) => dispatch({ type: "SET_MODE", mode }),
    []
  );

  return { state, start, pause, resume, restart, setMode };
}
