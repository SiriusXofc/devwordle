"use client";

import { useEffect } from "react";

export function useKeyboard(onKey: (key: string) => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.key === "Enter" || event.key === "Backspace" || event.key === "?" || /^[1-4a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        onKey(event.key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKey]);
}
