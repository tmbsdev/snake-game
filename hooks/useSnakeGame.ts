import { useReducer, useCallback, useEffect, useRef } from "react";
import { GameState, GameAction, Direction } from "@/lib/types";
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
} from "@/lib/gameEngine";
import { useGameLoop } from "./useGameLoop";
import { useKeyboard } from "./useKeyboard";
import { useSwipe } from "./useSwipe";

const MAX_INPUT_QUEUE = 2;

function createInitialState(highScore: number = 0): GameState {
  const snake = createInitialSnake(GRID_SIZE);
  return {
    snake,
    food: generateFood(snake, GRID_SIZE),
    direction: "RIGHT",
    nextDirection: "RIGHT",
    inputQueue: [],
    status: "IDLE",
    score: 0,
    highScore,
    gridSize: GRID_SIZE,
    tickInterval: TICK_INTERVAL,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TICK": {
      if (state.status !== "PLAYING") return state;

      // Process input queue
      let direction = state.direction;
      const queue = [...state.inputQueue];
      if (queue.length > 0) {
        const next = queue.shift()!;
        if (!isOppositeDirection(direction, next)) {
          direction = next;
        }
      }

      const head = state.snake[0];
      const nextHead = getNextHeadForDirection(head, direction);
      const eatsFood =
        nextHead.x === state.food.x && nextHead.y === state.food.y;
      const newSnake = eatsFood
        ? growSnake(state.snake, direction)
        : moveSnake(state.snake, direction);

      if (
        checkCollision(newSnake[0], state.gridSize) ||
        checkSelfCollision(newSnake)
      ) {
        const newHighScore = Math.max(state.score, state.highScore);
        playGameOver();
        return {
          ...state,
          direction,
          inputQueue: [],
          status: "GAME_OVER",
          highScore: newHighScore,
        };
      }

      const newScore = eatsFood ? state.score + SCORE_PER_FOOD : state.score;
      // Generate new food only after eating — must differ from current food
      const newFood = eatsFood
        ? generateFood(newSnake, state.gridSize)
        : state.food;

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
        highScore: Math.max(newScore, state.highScore),
      };
    }

    case "CHANGE_DIRECTION": {
      if (state.status !== "PLAYING") return state;

      const { direction } = action;
      const effectiveDir =
        state.inputQueue.length > 0
          ? state.inputQueue[state.inputQueue.length - 1]
          : state.direction;

      if (
        isOppositeDirection(effectiveDir, direction) ||
        effectiveDir === direction
      ) {
        return state;
      }

      if (state.inputQueue.length >= MAX_INPUT_QUEUE) {
        return state;
      }

      return {
        ...state,
        inputQueue: [...state.inputQueue, direction],
      };
    }

    case "START":
      if (state.status !== "IDLE") return state;
      // Re-generate food on start to ensure randomness after hydration
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
      const newState = createInitialState(state.highScore);
      return {
        ...newState,
        food: generateFood(newState.snake, newState.gridSize),
        status: "PLAYING",
      };
    }

    case "SET_HIGH_SCORE":
      return { ...state, highScore: action.highScore };

    default:
      return state;
  }
}

function getNextHeadForDirection(
  head: { x: number; y: number },
  direction: Direction
): { x: number; y: number } {
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

export function useSnakeGame(boardRef: React.RefObject<HTMLElement | null>) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  // Load high score from localStorage (SSR safe)
  useEffect(() => {
    const saved = localStorage.getItem("snakeHighScore");
    if (saved) {
      dispatch({ type: "SET_HIGH_SCORE", highScore: parseInt(saved, 10) });
    }
  }, []);

  // Save high score to localStorage
  const prevHighScore = useRef(0);
  useEffect(() => {
    if (state.highScore > prevHighScore.current) {
      prevHighScore.current = state.highScore;
      localStorage.setItem("snakeHighScore", String(state.highScore));
    }
  }, [state.highScore]);

  const tick = useCallback(() => {
    dispatch({ type: "TICK" });
  }, []);

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

  // Unlock audio on first interaction anywhere on the page (iOS Safari)
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

  return {
    state,
    start,
    pause,
    resume,
    restart,
  };
}
