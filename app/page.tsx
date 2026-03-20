"use client";

import { useRef } from "react";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { GameBoard } from "@/components/GameBoard";
import { GameUI } from "@/components/GameUI";
import { GameOver } from "@/components/GameOver";
import { GameControls } from "@/components/GameControls";
import { TouchTrail } from "@/components/TouchTrail";

export default function Home() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { state, start, pause, resume, restart } = useSnakeGame(boardRef);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 gap-2">
      <TouchTrail boardRef={boardRef} />

      <div className="flex flex-col items-center gap-1 mb-2">
        <h1 className="text-3xl font-bold text-white tracking-wider">SNAKE</h1>
        <GameUI score={state.score} highScore={state.highScore} />
      </div>

      <div className="relative w-full max-w-[500px]">
        <GameBoard ref={boardRef} state={state} />

        {state.status === "IDLE" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-10">
            <div className="flex flex-col items-center gap-4 p-8">
              <h2 className="text-4xl font-bold text-[#22c55e]">SNAKE</h2>
              {state.highScore > 0 && (
                <p className="text-gray-400 text-sm">
                  Best: <span className="text-[#22c55e]">{state.highScore}</span>
                </p>
              )}
              <button
                onClick={start}
                className="px-8 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg transition-colors text-lg"
              >
                Play
              </button>
              <p className="text-xs text-gray-500">
                Arrow keys / WASD / Swipe to move
              </p>
            </div>
          </div>
        )}

        {state.status === "GAME_OVER" && (
          <GameOver
            score={state.score}
            highScore={state.highScore}
            onRestart={restart}
          />
        )}
      </div>

      <GameControls
        status={state.status}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onRestart={restart}
      />

      <p className="text-xs text-gray-600 mt-2">Space to start / pause</p>
    </main>
  );
}
