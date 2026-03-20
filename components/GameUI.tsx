interface GameUIProps {
  score: number;
  highScore: number;
}

export function GameUI({ score, highScore }: GameUIProps) {
  return (
    <div className="flex justify-between items-center w-full max-w-[500px] px-2 py-3">
      <div className="text-white font-mono text-lg">
        Score: <span className="text-[#22c55e] font-bold">{score}</span>
      </div>
      <div className="text-gray-400 font-mono text-sm">
        Best: <span className="text-[#22c55e]">{highScore}</span>
      </div>
    </div>
  );
}
