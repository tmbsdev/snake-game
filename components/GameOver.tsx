interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export function GameOver({ score, highScore, onRestart }: GameOverProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg z-10">
      <div className="flex flex-col items-center gap-5 p-8">
        <h2 className="text-base font-bold text-red-500 tracking-widest">GAME OVER</h2>
        <div className="text-center flex flex-col gap-2">
          <p className="text-[11px] text-white tracking-wide">
            SCORE <span className="text-[#22c55e] font-bold">{score}</span>
          </p>
          <p className="text-[10px] text-gray-400 tracking-wide">
            BEST <span className="text-[#22c55e]">{highScore}</span>
          </p>
        </div>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg transition-colors text-[10px] tracking-widest"
        >
          PLAY AGAIN
        </button>
        <p className="text-[9px] text-gray-500 tracking-wide">OR PRESS SPACE</p>
      </div>
    </div>
  );
}
