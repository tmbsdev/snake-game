"use client";

import { useEffect, useRef } from "react";

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export function TouchTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<TrailDot[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    function handleTouchMove(e: TouchEvent) {
      const container = containerRef.current;
      if (!container) return;

      Array.from(e.touches).forEach((touch) => {
        const id = ++counterRef.current;
        const dot: TrailDot = { id, x: touch.clientX, y: touch.clientY };
        dotsRef.current.push(dot);

        // Create DOM element
        const el = document.createElement("div");
        el.style.cssText = `
          position: fixed;
          left: ${dot.x}px;
          top: ${dot.y}px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.7) 0%, rgba(34,197,94,0) 70%);
          transform: translate(-50%, -50%) scale(1);
          pointer-events: none;
          z-index: 9999;
          animation: trailFade 0.5s ease-out forwards;
        `;
        container.appendChild(el);

        setTimeout(() => {
          if (container.contains(el)) container.removeChild(el);
          dotsRef.current = dotsRef.current.filter((d) => d.id !== id);
        }, 500);
      });
    }

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes trailFade {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" />
    </>
  );
}
