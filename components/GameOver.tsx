interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export function GameOver({ score, highScore, onRestart }: GameOverProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg z-10">
      <div className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-3xl font-bold text-white">Game Over</h2>
        <div className="text-center">
          <p className="text-xl text-white">
            Score: <span className="text-[#22c55e] font-bold">{score}</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Best: <span className="text-[#22c55e]">{highScore}</span>
          </p>
        </div>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg transition-colors text-lg"
        >
          Play Again
        </button>
        <p className="text-xs text-gray-500">or press Space</p>
      </div>
    </div>
  );
}
