const SENIORITY = {
  1: { title: "10x Developer", color: "#fbbf24" },
  2: { title: "Senior Dev", color: "#22c55e" },
  3: { title: "Mid-level", color: "#60a5fa" },
  4: { title: "Junior", color: "#f97316" },
  5: { title: "Estagiário", color: "#f87171" },
  6: { title: "Stack Overflow Dev", color: "#a78bfa" },
} as const;

export function getSeniority(attempts: number) {
  return SENIORITY[Math.min(Math.max(attempts, 1), 6) as keyof typeof SENIORITY];
}
