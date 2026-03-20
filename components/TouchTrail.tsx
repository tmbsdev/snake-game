"use client";

import { useEffect, useRef } from "react";

interface TouchTrailProps {
  boardRef: React.RefObject<HTMLElement | null>;
}

export function TouchTrail({ boardRef }: TouchTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<Array<{ points: Array<{ x: number; y: number }>; startTime: number }>>([]);
  const currentPathRef = useRef<Array<{ x: number; y: number }> | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function isInBoard(x: number, y: number): boolean {
      const board = boardRef.current;
      if (!board) return false;
      const rect = board.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const now = Date.now();
      const DURATION = 600;

      pathsRef.current = pathsRef.current.filter((path) => {
        const age = now - path.startTime;
        if (age > DURATION) return false;
        if (path.points.length < 2) return true;

        const alpha = (1 - age / DURATION) * 0.65;
        ctx!.beginPath();
        ctx!.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          // Smooth curve through points
          const prev = path.points[i - 1];
          const curr = path.points[i];
          const mx = (prev.x + curr.x) / 2;
          const my = (prev.y + curr.y) / 2;
          ctx!.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx!.strokeStyle = `rgba(180, 180, 180, ${alpha})`;
        ctx!.lineWidth = 18;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();
        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    function handleTouchStart(e: TouchEvent) {
      Array.from(e.changedTouches).forEach((touch) => {
        if (!isInBoard(touch.clientX, touch.clientY)) return;
        const points: Array<{ x: number; y: number }> = [{ x: touch.clientX, y: touch.clientY }];
        currentPathRef.current = points;
        pathsRef.current.push({ points, startTime: Date.now() });
      });
    }

    function handleTouchMove(e: TouchEvent) {
      Array.from(e.changedTouches).forEach((touch) => {
        if (!isInBoard(touch.clientX, touch.clientY)) return;
        if (currentPathRef.current) {
          currentPathRef.current.push({ x: touch.clientX, y: touch.clientY });
          // Reset timer while still moving
          const last = pathsRef.current[pathsRef.current.length - 1];
          if (last) last.startTime = Date.now();
        }
      });
    }

    function handleTouchEnd() {
      currentPathRef.current = null;
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [boardRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
