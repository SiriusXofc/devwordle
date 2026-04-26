import { GameBoard } from "@/components/game/GameBoard";
import type { GameMode } from "@/lib/gameModes";

const modeMap: Record<string, GameMode> = {
  classic: "CLASSIC",
  speed: "SPEED",
  hard: "HARD",
  daily: "DAILY",
};

export default function ModePage({ params }: { params: { mode: string } }) {
  return <GameBoard mode={modeMap[params.mode] ?? "CLASSIC"} />;
}
