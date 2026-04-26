"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Guess } from "@/hooks/useWordle";

const emoji = {
  correct: "🟩",
  present: "🟨",
  absent: "⬛",
};

export function DailyShare({
  open,
  onOpenChange,
  guesses,
  won,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guesses: Guess[];
  won: boolean;
}) {
  const text = useMemo(() => {
    const rows = guesses.map((guess) => guess.result.map((state) => emoji[state]).join("")).join("\n");
    return `DEVWORDLE DIÁRIO\n${rows}\nTentativas: ${won ? guesses.length : "X"}/6`;
  }, [guesses, won]);

  const [copied, setCopied] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resultado diário</DialogTitle>
        </DialogHeader>
        <pre className="whitespace-pre-wrap border border-zinc-800 bg-black p-3 font-mono text-sm text-zinc-200">{text}</pre>
        <Button
          variant="outline"
          className="rounded-none border-green-800 bg-black font-mono text-green-400 hover:bg-green-950"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast("resultado copiado");
          }}
        >
          {copied ? "COPIADO" : "COPIAR"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
