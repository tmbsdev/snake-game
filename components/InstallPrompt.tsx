"use client";

import { useEffect, useState } from "react";

type Platform = "ios" | "android" | "other";

const STORAGE_KEY = "pwaPromptDismissed";
const PROMPT_COOLDOWN_DAYS = 3;

function getPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

function shouldShow(): boolean {
  if (isStandalone()) return false;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return true;
  const dismissedAt = parseInt(saved, 10);
  const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return daysSince >= PROMPT_COOLDOWN_DAYS;
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    if (shouldShow()) {
      setPlatform(getPlatform());
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible || platform === "other") return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-[11px] text-white font-bold tracking-wide">ADD TO HOME SCREEN</p>
          <p className="text-[9px] text-gray-400 mt-1 tracking-wide">For a better app experience</p>
        </div>

        {platform === "ios" && (
          <div className="flex flex-col gap-3 text-[9px] text-gray-300 tracking-wide">
            <div className="flex items-start gap-2">
              <span className="text-[#22c55e] flex-shrink-0">1</span>
              <span>Tap the <span className="text-white">Share</span> button at the bottom of your browser</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22c55e] flex-shrink-0">2</span>
              <span>Scroll down and tap <span className="text-white">Add to Home Screen</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22c55e] flex-shrink-0">3</span>
              <span>Tap <span className="text-white">Add</span> in the top right corner</span>
            </div>
          </div>
        )}

        {platform === "android" && (
          <div className="flex flex-col gap-3 text-[9px] text-gray-300 tracking-wide">
            <div className="flex items-start gap-2">
              <span className="text-[#22c55e] flex-shrink-0">1</span>
              <span>Tap the <span className="text-white">menu button</span> in your browser</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22c55e] flex-shrink-0">2</span>
              <span>Tap <span className="text-white">Add to Home Screen</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22c55e] flex-shrink-0">3</span>
              <span>Tap <span className="text-white">Add</span> to confirm</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-1">
          <button
            onClick={dismiss}
            className="flex-1 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg text-[9px] tracking-widest transition-colors"
          >
            GOT IT
          </button>
          <button
            onClick={dismiss}
            className="px-4 py-2.5 border border-gray-600 text-gray-400 hover:text-white rounded-lg text-[9px] tracking-wide transition-colors"
          >
            LATER
          </button>
        </div>
      </div>
    </div>
  );
}
