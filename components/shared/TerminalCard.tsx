import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function TerminalCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-none border border-zinc-800 bg-black shadow-none before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-green-500 before:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
