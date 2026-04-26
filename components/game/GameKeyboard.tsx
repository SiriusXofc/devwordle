"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LetterMap, LetterResult } from "@/hooks/useWordle";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENT", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
];

function keyStateClass(state?: LetterResult) {
  const base = "transition-colors duration-100";
  if (state === "correct") {
    return `${base} border-green-700 bg-green-900 text-white hover:bg-green-800`;
  }

  if (state === "present") {
    return `${base} border-yellow-700 bg-yellow-900 text-white hover:bg-yellow-800`;
  }

  if (state === "absent") {
    return `${base} border-zinc-900 bg-zinc-950 text-zinc-600 hover:bg-zinc-950`;
  }

  return `${base} border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 active:scale-95`;
}

type GameKeyboardProps = {
  letterMap: LetterMap;
  onKey: (key: string) => void;
  disabled?: boolean;
};

export function GameKeyboard({ letterMap, onKey, disabled }: GameKeyboardProps) {
  return (
    <div className="grid gap-2">
      <div className="grid max-w-full gap-1 overflow-hidden">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex max-w-full flex-wrap justify-center gap-1">
            {row.map((key) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "h-9 rounded-none px-1.5 font-mono text-[11px] sm:h-10 sm:px-2 sm:text-xs",
                  key === "ENT" || key === "DEL" ? "min-w-[44px] sm:min-w-14" : "min-w-[28px]",
                  disabled && "cursor-not-allowed",
                  keyStateClass(letterMap[key]),
                )}
                style={
                  key === "ENT" || key === "DEL"
                    ? { width: "clamp(44px, calc((100vw - 48px) / 6), 56px)" }
                    : { width: "clamp(28px, calc((100vw - 48px) / 10), 36px)" }
                }
                onClick={() => onKey(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
