import { GameMode } from "@/lib/types";

interface GameUIProps {
  score: number;
  highScore: number;
  highScoreWrap: number;
  mode: GameMode;
}

export function GameUI({ score, highScore, highScoreWrap, mode }: GameUIProps) {
  const best = mode === "wrap" ? highScoreWrap : highScore;
  return (
    <div className="flex justify-between items-center w-full max-w-[500px] px-2 py-2 gap-8">
      <div className="text-white font-mono text-lg">
        Score: <span className="text-[#22c55e] font-bold">{score}</span>
      </div>
      <div className="text-gray-400 font-mono text-sm">
        Best: <span className="text-[#22c55e]">{best}</span>
      </div>
    </div>
  );
}
