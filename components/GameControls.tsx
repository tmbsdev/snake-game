import { GameStatus } from "@/lib/types";

interface GameControlsProps {
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export function GameControls({
  status,
  onStart,
  onPause,
  onResume,
  onRestart,
}: GameControlsProps) {
  return (
    <div className="flex gap-3 mt-4">
      {status === "IDLE" && (
        <button
          onClick={onStart}
          className="px-6 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg transition-colors"
        >
          Start
        </button>
      )}
      {status === "PLAYING" && (
        <button
          onClick={onPause}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          Pause
        </button>
      )}
      {status === "PAUSED" && (
        <>
          <button
            onClick={onResume}
            className="px-6 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg transition-colors"
          >
            Resume
          </button>
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
          >
            Restart
          </button>
        </>
      )}
    </div>
  );
}
