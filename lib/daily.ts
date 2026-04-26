import { DAILY_WORD_POOL } from "@/lib/words";

export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getDailyWord(date = new Date()) {
  return DAILY_WORD_POOL[getDayOfYear(date) % DAILY_WORD_POOL.length];
}

export function getDailyKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getNextDailyMs(date = new Date()) {
  const next = new Date(date);
  next.setHours(24, 0, 0, 0);
  return Math.max(next.getTime() - date.getTime(), 0);
}
