"use client";

import { useEffect, useState } from "react";

export function useTimer(seconds: number, running: boolean, onDone?: () => void) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemaining((value) => {
        const next = Math.max(value - 1, 0);
        if (next === 0) {
          window.clearInterval(interval);
          onDone?.();
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onDone, running]);

  return { remaining, reset: () => setRemaining(seconds) };
}
