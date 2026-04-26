import type { GameMode } from "@/lib/gameModes";
import { WORDS, getWordsByMode } from "@/lib/words";

const ALL_WORDS = new Set(WORDS.map((word) => word.toUpperCase()));

export function validateGamePayload(payload: {
  word: string;
  attempts: number;
  won: boolean;
  mode: GameMode;
  duration: number;
  timeRemaining?: number | null;
}) {
  const word = payload.word.toUpperCase();
  const maxAttempts = payload.mode === "HARD" ? 4 : 6;

  if (!ALL_WORDS.has(word)) {
    return "palavra inválida";
  }

  if (!getWordsByMode(payload.mode).includes(word)) {
    return "palavra inválida para este modo";
  }

  if (payload.attempts > maxAttempts) {
    return "tentativas inconsistentes";
  }

  if (!payload.won && payload.mode !== "SPEED" && payload.attempts !== maxAttempts) {
    return "tentativas inconsistentes com derrota";
  }

  if (payload.duration < 3 || payload.duration > 3600) {
    return "duração inválida";
  }

  if (payload.mode === "SPEED") {
    const timeRemaining = payload.timeRemaining ?? 0;
    if (timeRemaining < 0 || timeRemaining > 90) {
      return "tempo inválido";
    }

    const maxPossibleRemaining = 90 - payload.duration;
    if (timeRemaining > maxPossibleRemaining + 5) {
      return "tempo inválido";
    }
  }

  return null;
}
