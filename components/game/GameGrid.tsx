"use client";

import { GameTile } from "@/components/game/GameTile";
import { cn } from "@/lib/utils";
import type { Guess } from "@/hooks/useWordle";

type GameGridProps = {
  guesses: Guess[];
  current: string;
  shakeRow: number | null;
  lastSubmittedRow: number | null;
  popKey: number;
  submitKey: number;
  won?: boolean;
  gameOver?: boolean;
};

export function GameGrid({ guesses, current, shakeRow, lastSubmittedRow, popKey, submitKey, won, gameOver }: GameGridProps) {
  return (
    <div role="grid" aria-label="Grade do DevWordle" className="grid max-w-full gap-1">
      {Array.from({ length: 6 }).map((_, rowIndex) => {
        const guess = guesses[rowIndex];
        const isCurrentRow = rowIndex === guesses.length;
        const word = guess?.word ?? (isCurrentRow ? current : "");

        return (
          <div key={rowIndex} role="row" className={cn("grid grid-cols-5 gap-1", shakeRow === rowIndex && "animate-shake")}>
            {Array.from({ length: 5 }).map((__, columnIndex) => {
              const hasLetter = Boolean(word[columnIndex]);
              const shouldPop = isCurrentRow && hasLetter && columnIndex === current.length - 1 && popKey > 0;

              return (
                <GameTile
                  key={`${submitKey}-${rowIndex}-${columnIndex}-${shouldPop ? popKey : "tile"}`}
                  letter={word[columnIndex] ?? ""}
                  result={guess?.result[columnIndex]}
                  active={isCurrentRow && columnIndex === current.length && !guess}
                  pop={shouldPop}
                  flip={lastSubmittedRow === rowIndex}
                  win={won && rowIndex === guesses.length - 1}
                  loss={gameOver && !won && rowIndex === guesses.length - 1}
                  delay={columnIndex * 100}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
