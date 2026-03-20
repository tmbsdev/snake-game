"use client";

import { useRef } from "react";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { GameBoard } from "@/components/GameBoard";
import { GameUI } from "@/components/GameUI";
import { GameOver } from "@/components/GameOver";
import { GameControls } from "@/components/GameControls";
import { TouchTrail } from "@/components/TouchTrail";
import { InstallPrompt } from "@/components/InstallPrompt";
import { unlockAudio } from "@/lib/sounds";
import pkg from "@/package.json";

export default function Home() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { state, start, pause, resume, restart, setMode } = useSnakeGame(boardRef);

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-4 gap-2"
      onPointerDown={unlockAudio}
    >
      <TouchTrail boardRef={boardRef} />
      <InstallPrompt />

      {/* Header */}
      <div className="flex flex-col items-center gap-1 w-full max-w-[500px]">
        <div className="flex items-center justify-between w-full px-2">
          <h1 className="text-lg font-bold text-white tracking-widest">SNAKE</h1>

          {/* Wrap mode toggle — only visible in IDLE */}
          {state.status === "IDLE" && (
            <button
              onClick={() => setMode(state.mode === "classic" ? "wrap" : "classic")}
              className={`flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-full border transition-colors ${
                state.mode === "wrap"
                  ? "border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10"
                  : "border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              <span
                className={`inline-flex items-center w-8 h-4 rounded-full relative transition-colors flex-shrink-0 ${
                  state.mode === "wrap" ? "bg-[#22c55e]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute w-3 h-3 rounded-full bg-white transition-transform ${
                    state.mode === "wrap" ? "translate-x-[18px]" : "translate-x-[2px]"
                  }`}
                />
              </span>
              WRAP
            </button>
          )}

          {/* Mode badge during play */}
          {state.status !== "IDLE" && (
            <span className="text-[10px] text-gray-500 px-2 py-1 rounded border border-gray-700">
              {state.mode === "wrap" ? "WRAP" : "CLASSIC"}
            </span>
          )}
        </div>

        <GameUI
          score={state.score}
          highScore={state.highScore}
          highScoreWrap={state.highScoreWrap}
          mode={state.mode}
        />
      </div>

      {/* Game board */}
      <div className="relative w-full max-w-[500px]">
        <GameBoard ref={boardRef} state={state} />

        {state.status === "IDLE" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-10">
            <div className="flex flex-col items-center gap-5 p-8">
              <h2 className="text-xl font-bold text-[#22c55e] tracking-widest">SNAKE</h2>
              <div className="flex flex-col gap-1 text-[10px] text-gray-400 text-center">
                <span>CLASSIC BEST: <span className="text-white">{state.highScore}</span></span>
                <span>WRAP BEST: <span className="text-white">{state.highScoreWrap}</span></span>
              </div>
              <button
                onClick={start}
                className="px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg transition-colors text-xs tracking-widest"
              >
                PLAY
              </button>
              <p className="text-[9px] text-gray-500 text-center">
                ARROWS / WASD / SWIPE
              </p>
            </div>
          </div>
        )}

        {state.status === "GAME_OVER" && (
          <GameOver
            score={state.score}
            highScore={state.mode === "wrap" ? state.highScoreWrap : state.highScore}
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

      <p className="text-[9px] text-gray-600 mt-2">SPACE TO START / PAUSE</p>
      <span className="fixed bottom-2 right-3 text-[9px] text-gray-700 select-none">
        v{pkg.version}
      </span>
    </main>
  );
}
