import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SectionLabel({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600", className)} {...props} />;
}
