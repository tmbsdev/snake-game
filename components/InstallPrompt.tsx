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
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌼</span>
          <div>
            <p className="text-[11px] text-white font-bold tracking-wide">ANA EKRANA EKLE</p>
            <p className="text-[9px] text-gray-400 mt-1 tracking-wide">Tam ekran deneyim için</p>
          </div>
        </div>

        {platform === "ios" && (
          <div className="flex flex-col gap-2 text-[9px] text-gray-300 tracking-wide">
            <div className="flex items-center gap-2">
              <span className="text-[#22c55e]">1</span>
              <span>Alttaki <span className="text-white">Paylaş</span> butonuna bas <span className="text-gray-500">(□↑)</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#22c55e]">2</span>
              <span><span className="text-white">&quot;Ana Ekrana Ekle&quot;</span> seçeneğine dokun</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#22c55e]">3</span>
              <span>Sağ üstten <span className="text-white">Ekle</span>&apos;ye bas</span>
            </div>
          </div>
        )}

        {platform === "android" && (
          <div className="flex flex-col gap-2 text-[9px] text-gray-300 tracking-wide">
            <div className="flex items-center gap-2">
              <span className="text-[#22c55e]">1</span>
              <span>Sağ üstteki <span className="text-white">⋮ menüsüne</span> bas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#22c55e]">2</span>
              <span><span className="text-white">&quot;Ana Ekrana Ekle&quot;</span> seçeneğine dokun</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#22c55e]">3</span>
              <span><span className="text-white">Ekle</span>&apos;ye bas</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-1">
          <button
            onClick={dismiss}
            className="flex-1 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-lg text-[9px] tracking-widest transition-colors"
          >
            ANLADIM
          </button>
          <button
            onClick={dismiss}
            className="px-4 py-2.5 border border-gray-600 text-gray-400 hover:text-white rounded-lg text-[9px] tracking-wide transition-colors"
          >
            KAPAT
          </button>
        </div>
      </div>
    </div>
  );
}
