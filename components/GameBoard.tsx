import { useMemo, forwardRef } from "react";
import { GameState } from "@/lib/types";
import { GameCell } from "./GameCell";

interface GameBoardProps {
  state: GameState;
}

export const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(
  function GameBoard({ state }, ref) {
    const { snake, food, gridSize } = state;

    const snakeSet = useMemo(() => {
      const map = new Map<string, "snake-head" | "snake-body">();
      snake.forEach((p, i) => {
        map.set(`${p.x},${p.y}`, i === 0 ? "snake-head" : "snake-body");
      });
      return map;
    }, [snake]);

    const cells = useMemo(() => {
      const result = [];
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const key = `${x},${y}`;
          let type: "empty" | "snake-head" | "snake-body" | "food" = "empty";

          const snakeType = snakeSet.get(key);
          if (snakeType) {
            type = snakeType;
          } else if (x === food.x && y === food.y) {
            type = "food";
          }

          result.push(<GameCell key={key} type={type} />);
        }
      }
      return result;
    }, [gridSize, snakeSet, food.x, food.y]);

    return (
      <div
        ref={ref}
        className="grid gap-[1px] bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-[1px] aspect-square w-full max-w-[500px] touch-none select-none"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {cells}
      </div>
    );
  }
);
