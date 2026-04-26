"use client";

import { cn } from "@/lib/utils";
import type { LetterResult } from "@/hooks/useWordle";

type GameTileProps = {
  letter: string;
  result?: LetterResult;
  active?: boolean;
  pop?: boolean;
  flip?: boolean;
  win?: boolean;
  loss?: boolean;
  delay?: number;
};

export function GameTile({ letter, result, active, pop, flip, win, loss, delay = 0 }: GameTileProps) {
  return (
    <div
      role="cell"
      aria-label={
        result
          ? `${letter}: ${
              result === "correct" ? "posição correta" : result === "present" ? "letra presente" : "letra ausente"
            }`
          : letter || "vazio"
      }
      className={cn(
        "flex h-[clamp(40px,11vw,52px)] w-[clamp(40px,11vw,52px)] items-center justify-center rounded-none border bg-black font-mono text-base font-medium text-zinc-100 [backface-visibility:hidden] [transform-style:preserve-3d] sm:text-xl",
        "border-zinc-900",
        active && "border-zinc-500",
        result === "correct" && "border-green-600 bg-green-900 text-white",
        result === "present" && "border-yellow-600 bg-yellow-900 text-white",
        result === "absent" && "border-zinc-800 bg-zinc-900 text-zinc-500",
        pop && "animate-pop",
        flip && "animate-flip",
        win && "animate-tileWin",
        loss && result === "absent" && "animate-tileLoss",
      )}
      style={{ animationDelay: flip || win || loss ? `${delay}ms` : undefined }}
    >
      {letter || (active ? <span className="h-5 w-[2px] animate-cursor bg-green-500" aria-hidden /> : null)}
    </div>
  );
}
