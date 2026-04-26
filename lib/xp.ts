import type { GameMode } from "@/lib/gameModes";

const WIN_XP: Record<number, number> = {
  1: 100,
  2: 80,
  3: 60,
  4: 40,
  5: 25,
  6: 15,
};

const HINT_PENALTY: Record<GameMode, number> = {
  CLASSIC: 15,
  SPEED: 15,
  HARD: 0,
  DAILY: 20,
};

export function calculateXp({
  won,
  attempts,
  mode,
  hintUsed,
  timeRemaining = 0,
  streak = 0,
}: {
  won: boolean;
  attempts: number;
  mode: GameMode;
  hintUsed?: boolean;
  timeRemaining?: number;
  streak?: number;
}) {
  if (!won) {
    return mode === "HARD" ? 5 : 0;
  }

  let xp = WIN_XP[Math.min(attempts, 6)] ?? 15;

  if (mode === "SPEED") {
    xp += Math.floor(Math.max(timeRemaining, 0) / 3);
  }

  if (mode === "HARD") {
    xp = Math.floor(xp * 1.5) + 80;
  }

  if (mode === "DAILY") {
    xp += 50 + Math.min(Math.max(streak, 0), 7) * 5;
  }

  if (hintUsed) {
    xp -= HINT_PENALTY[mode] ?? 15;
  }

  return Math.max(xp, 0);
}
