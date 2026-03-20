"use client";

import { useEffect, useRef } from "react";

export function TouchTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    function spawnDot(x: number, y: number) {
      const container = containerRef.current;
      if (!container) return;

      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(34,197,94,0.8) 0%, rgba(34,197,94,0.2) 60%, transparent 100%);
        transform: translate(-50%, -50%) scale(0.5);
        pointer-events: none;
        z-index: 9999;
        animation: trailFade 0.45s ease-out forwards;
      `;
      container.appendChild(el);
      setTimeout(() => {
        if (container.contains(el)) container.removeChild(el);
      }, 450);
    }

    function handleTouchStart(e: TouchEvent) {
      Array.from(e.touches).forEach((t) => spawnDot(t.clientX, t.clientY));
    }

    function handleTouchMove(e: TouchEvent) {
      // Throttle: spawn every other move event
      counterRef.current++;
      if (counterRef.current % 2 !== 0) return;
      Array.from(e.touches).forEach((t) => spawnDot(t.clientX, t.clientY));
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes trailFade {
          0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          60%  { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2);   opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{zIndex: 9999}} />
    </>
  );
}
