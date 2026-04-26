"use client";

export function SessionPanel({
  attemptsUsed,
  maxAttempts,
  mode,
}: {
  attemptsUsed: number;
  maxAttempts: number;
  mode: string;
}) {
  return (
    <div className="grid gap-2 border border-zinc-900 bg-zinc-950/40 px-3 py-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-zinc-600">
        <span>{mode}</span>
        <span>
          tentativa {Math.min(attemptsUsed + 1, maxAttempts)}/{maxAttempts}
        </span>
      </div>
      <div className="h-1 bg-zinc-900">
        <div className="h-1 bg-green-500" style={{ width: `${(Math.min(attemptsUsed, maxAttempts) / maxAttempts) * 100}%` }} />
      </div>
    </div>
  );
}
