"use client";

import { Progress } from "@/components/ui/progress";

function colorForTime(remaining: number, total: number) {
  const ratio = Math.max(Math.min(remaining / total, 1), 0);

  if (ratio > 0.5) {
    const t = 1 - (ratio - 0.5) * 2;
    return `rgb(${Math.round(34 + t * 200)}, ${Math.round(197 - t * 18)}, ${Math.round(94 - t * 86)})`;
  }

  const t = 1 - ratio * 2;
  return `rgb(${Math.round(234 + t * 5)}, ${Math.round(179 - t * 111)}, ${Math.round(8 - t * 8)})`;
}

export function SpeedTimer({ remaining, total = 90 }: { remaining: number; total?: number }) {
  return (
    <div className="grid gap-1">
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-zinc-600">
        <span>SPEED TIMER</span>
        <span className={remaining < 10 ? "animate-pulse text-red-400" : remaining < 15 ? "text-red-400" : "text-green-400"}>
          {remaining}s
        </span>
      </div>
      <Progress
        value={(remaining / total) * 100}
        className="h-1 rounded-none bg-zinc-900"
        indicatorClassName="rounded-none transition-colors duration-1000"
        indicatorStyle={{ backgroundColor: colorForTime(remaining, total) }}
      />
    </div>
  );
}
