"use client";

import type { GameMode } from "@/lib/gameModes";

export function GameSidePanel({
  mode,
  hint,
  attemptsUntilHint,
  hintLocked = false,
}: {
  mode: GameMode;
  hint: { category: string; hint: string } | null;
  attemptsUntilHint: number;
  hintLocked?: boolean;
}) {
  return (
    <aside className="hidden self-start gap-4 lg:grid">
      <div className="border border-zinc-800 bg-zinc-950 p-5">
        <p className="font-mono text-[10px] tracking-widest text-zinc-600">MODO ATUAL</p>
        <p className="mt-2 font-mono text-lg text-green-400">{mode}</p>
        <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">
          {mode === "HARD"
            ? "letras confirmadas são obrigatórias nos próximos chutes."
            : mode === "SPEED"
              ? "60 segundos. palavras em sequencia. sem pausa."
              : mode === "DAILY"
                ? "uma palavra. todos os jogadores. reinicia à meia-noite."
                : "6 tentativas. sem timer. modo padrão."}
        </p>
      </div>

      <div className="border border-zinc-800 bg-zinc-950 p-5">
        <p className="font-mono text-[10px] tracking-widest text-zinc-600">DICA</p>
        {hintLocked ? (
          <p className="mt-2 font-mono text-xs text-zinc-600">bloqueada no modo difícil.</p>
        ) : hint ? (
          <>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-yellow-500">{hint.category}</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-zinc-300">{hint.hint}</p>
          </>
        ) : (
          <p className="mt-2 font-mono text-xs text-zinc-600">
                {attemptsUntilHint > 0 ? `desbloqueia em ${attemptsUntilHint} tentativa(s).` : "use o botão de dica para revelar."}
          </p>
        )}
      </div>
    </aside>
  );
}
