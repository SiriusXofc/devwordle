"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "rounded-none border border-zinc-800 bg-zinc-950 font-mono text-zinc-100",
          title: "font-mono text-xs",
          description: "font-mono text-[10px] text-zinc-500",
          actionButton: "rounded-none bg-green-950 text-green-400",
        },
      }}
    />
  );
}
