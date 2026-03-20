import { useEffect, useRef } from "react";
import { Direction } from "@/lib/types";

const MIN_SWIPE_DELTA = 30;

export function useSwipe(
  onDirection: (dir: Direction) => void,
  elementRef: React.RefObject<HTMLElement | null>
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < MIN_SWIPE_DELTA && absDy < MIN_SWIPE_DELTA) return;

      if (absDx > absDy) {
        onDirection(dx > 0 ? "RIGHT" : "LEFT");
      } else {
        onDirection(dy > 0 ? "DOWN" : "UP");
      }
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onDirection, elementRef]);
}
