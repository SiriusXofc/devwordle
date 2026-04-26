"use client";

import { Button } from "@/components/ui/button";

export function HintButton({
  visible,
  hint,
  category,
  attemptsUntilVisible = 0,
  onClick,
}: {
  visible: boolean;
  hint: { category: string; hint: string } | null;
  category?: string;
  attemptsUntilVisible?: number;
  onClick: () => void;
}) {
  if (!visible) {
    if (attemptsUntilVisible <= 0) {
      return null;
    }

    return (
      <div className="border border-zinc-900 bg-zinc-950/40 px-3 py-2 text-center">
        <p className="font-mono text-[9px] tracking-widest text-zinc-700">
          {"//"} hint disponível em {attemptsUntilVisible}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-2 border border-zinc-900 bg-zinc-950/60 p-3 text-center duration-200">
      {hint ? (
        <div className="grid gap-1">
          <p className="font-mono text-[9px] tracking-[0.28em] text-yellow-500">DICA · {hint.category.toUpperCase()}</p>
          <p className="font-mono text-xs leading-5 text-zinc-300">{hint.hint}</p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-left font-mono text-[10px] leading-5 tracking-widest text-zinc-600">
            {category ? `categoria: ${category}` : "uma pista leve está disponível"}
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-none border-yellow-800 bg-black font-mono text-[10px] tracking-widest text-yellow-400 hover:bg-yellow-950"
            onClick={onClick}
          >
            &gt; REVELAR DICA —10xp
          </Button>
        </div>
      )}
    </div>
  );
}
