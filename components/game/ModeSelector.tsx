"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { GameMode } from "@/lib/gameModes";

const modes: Array<{ value: GameMode; label: string; href: string; title: string }> = [
  { value: "CLASSIC", label: "CLS", href: "/game/classic", title: "Clássico: 6 tentativas, sem limite de tempo" },
  { value: "SPEED", label: "SPD", href: "/game/speed", title: "Speed: 60 segundos para acertar o máximo possível" },
  { value: "HARD", label: "HRD", href: "/game/hard", title: "Difícil: letras confirmadas devem ser reusadas" },
  { value: "DAILY", label: "DLY", href: "/game/daily", title: "Diário: mesma palavra para todo mundo no dia" },
];

export function ModeSelector({ mode, dirty = false }: { mode: GameMode; dirty?: boolean }) {
  const router = useRouter();
  const [pendingMode, setPendingMode] = useState<(typeof modes)[number] | null>(null);

  function changeMode(item: (typeof modes)[number]) {
    if (item.value === mode) {
      return;
    }

    if (dirty) {
      setPendingMode(item);
      return;
    }

    router.push(item.href);
  }

  return (
    <>
      <div className="flex border-b border-zinc-900" role="tablist" aria-label="Modos de jogo">
        {modes.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={mode === item.value}
            title={item.title}
            onClick={() => changeMode(item)}
            className={cn(
              "flex-1 border-b border-transparent px-1 pb-2 font-mono text-[10px] tracking-widest text-zinc-600 transition-colors duration-100 hover:text-zinc-300",
              mode === item.value && "border-green-500 text-green-400",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AlertDialog open={Boolean(pendingMode)} onOpenChange={(open) => !open && setPendingMode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>TROCAR MODO?</AlertDialogTitle>
            <AlertDialogDescription>
              A partida atual será reiniciada e as letras digitadas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none border-zinc-800 bg-black font-mono text-xs text-zinc-400 hover:bg-zinc-900">
              CANCELAR
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none border border-green-800 bg-green-950 font-mono text-xs text-green-400 hover:bg-green-900"
              onClick={() => {
                if (pendingMode) {
                  router.push(pendingMode.href);
                }
              }}
            >
              TROCAR E REINICIAR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
