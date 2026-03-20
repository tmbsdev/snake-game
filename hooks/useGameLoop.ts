import { useEffect, useRef } from "react";

export function useGameLoop(callback: () => void, interval: number, active: boolean) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      callbackRef.current();
    }, interval);

    return () => clearInterval(id);
  }, [interval, active]);
}
