"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GameMode } from "@/lib/gameModes";
import type { getSeniority } from "@/lib/seniority";

type Seniority = ReturnType<typeof getSeniority>;

export function buildShareText(
  mode: GameMode,
  guesses: Array<{ result: Array<"correct" | "present" | "absent"> }>,
  won: boolean,
) {
  const grid = guesses
    .map((guess) =>
      guess.result.map((state) => (state === "correct" ? "🟩" : state === "present" ? "🟨" : "⬛")).join(""),
    )
    .join("\n");

  return `DevWordle - ${mode}\n${won ? guesses.length : "X"}/6\n\n${grid}\n\ndevwordle.app`;
}

export function GameOverPanel({
  mode,
  won,
  target,
  attemptsUsed,
  seniority,
  winMessage,
  guesses,
  onReset,
}: {
  mode: GameMode;
  won: boolean;
  target: string;
  attemptsUsed: number;
  seniority: Seniority | null;
  winMessage: string;
  guesses: Array<{ result: Array<"correct" | "present" | "absent"> }>;
  onReset: () => void;
}) {
  return (
    <div className="min-h-16 animate-in fade-in slide-in-from-bottom-2 text-center duration-300">
      {won && seniority ? (
        <>
          <p className="text-[10px] tracking-[0.35em] text-zinc-600">RESOLVIDO EM {attemptsUsed} TENTATIVA(S)</p>
          <p className="mt-1 font-mono text-2xl font-bold text-green-400">{target}</p>
          <p className="mt-1 text-[10px] tracking-widest text-zinc-600">{winMessage}</p>
          <Badge style={{ color: seniority.color }} className="mt-1 border-zinc-700 bg-transparent font-mono text-sm">
            {seniority.title}
          </Badge>
        </>
      ) : (
        <p className="font-mono text-sm text-zinc-400">
          &gt; exception: MaxAttemptsExceeded
          <br />
          &gt; word: <span className="font-medium text-green-400">{target}</span>
          <br />
          &gt; status: game over
        </p>
      )}

      <div className="mx-auto mt-3 grid max-w-xs gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full border-green-800 bg-black font-mono text-[11px] tracking-widest text-green-400 hover:bg-green-950"
          onClick={onReset}
        >
          &gt; NOVA SESSÃO
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-zinc-800 bg-black font-mono text-[11px] tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-green-400"
          onClick={async () => {
            await navigator.clipboard.writeText(buildShareText(mode, guesses, won));
            toast.success("> grid copiado para o clipboard.");
          }}
        >
          &gt; COPIAR GRID
        </Button>
      </div>
    </div>
  );
}
