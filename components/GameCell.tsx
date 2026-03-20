import { memo } from "react";

type CellType = "empty" | "snake-head" | "snake-body" | "food";

interface GameCellProps {
  type: CellType;
}

function GameCellInner({ type }: GameCellProps) {
  let className = "w-full h-full rounded-sm ";

  switch (type) {
    case "snake-head":
      className += "bg-[#4ade80]";
      break;
    case "snake-body":
      className += "bg-[#22c55e]";
      break;
    case "food":
      className += "bg-[#ef4444] animate-pulse-food rounded-full";
      break;
    default:
      className += "bg-[#1a1a1a]";
      break;
  }

  return <div className={className} />;
}

export const GameCell = memo(GameCellInner);
