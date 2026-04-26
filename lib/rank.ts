export type Rank = {
  name: string;
  code: string;
  color: string;
  min: number;
  max: number | null;
};

export const RANKS: Rank[] = [
  { name: "INICIANTE", code: "INI", color: "#6b7280", min: 0, max: 149 },
  { name: "ESTAGIÁRIO", code: "EST", color: "#f87171", min: 150, max: 399 },
  { name: "JUNIOR", code: "JUN", color: "#f97316", min: 400, max: 799 },
  { name: "PLENO", code: "PLN", color: "#60a5fa", min: 800, max: 1399 },
  { name: "SENIOR", code: "SEN", color: "#22c55e", min: 1400, max: 2499 },
  { name: "STAFF", code: "STF", color: "#a78bfa", min: 2500, max: 4499 },
  { name: "PRINCIPAL", code: "PRI", color: "#fbbf24", min: 4500, max: 7999 },
  { name: "10x DEVELOPER", code: "10X", color: "#ffffff", min: 8000, max: null },
];

export function getRankByXp(xp: number) {
  return RANKS.find((rank) => xp >= rank.min && (rank.max === null || xp <= rank.max)) ?? RANKS[0];
}

export function getNextRank(xp: number) {
  return RANKS.find((rank) => rank.min > xp) ?? null;
}
