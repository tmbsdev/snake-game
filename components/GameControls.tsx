import { GameStatus } from "@/lib/types";

interface GameControlsProps {
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GameControls({ status, onStart, onPause, onResume, onRestart }: GameControlsProps) {
  return (
    <div className="flex gap-3 mt-2">
      {status === "PLAYING" && (
        <button
          onClick={onPause}
          className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors text-[10px] tracking-widest"
        >
          PAUSE
        </button>
      )}
      {status === "PAUSED" && (
        <>
          <button
            onClick={onResume}
            className="px-5 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg transition-colors text-[10px] tracking-widest"
          >
            RESUME
          </button>
          <button
            onClick={onRestart}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors text-[10px] tracking-widest"
          >
            RESTART
          </button>
        </>
      )}
    </div>
  );
}
