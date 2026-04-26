"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Game = {
  id: string;
  createdAt: string | Date;
  word: string;
  attempts: number;
  mode: string;
  duration: number;
  xpEarned: number;
  won: boolean;
};

export function GameHistory({ games }: { games: Game[] }) {
  const [page, setPage] = useState(0);
  const perPage = 20;
  const paginated = games.slice(page * perPage, (page + 1) * perPage);
  const hasPrevious = page > 0;
  const hasNext = (page + 1) * perPage < games.length;

  if (games.length === 0) {
    return <EmptyState title="historico vazio" description="jogue logado para registrar suas partidas" actionHref="/game" actionLabel="jogar agora" />;
  }

  return (
    <div className="grid gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>DATA</TableHead>
            <TableHead>PALAVRA</TableHead>
            <TableHead>TENTATIVAS</TableHead>
            <TableHead>MODO</TableHead>
            <TableHead>DURAÇÃO</TableHead>
            <TableHead>XP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((game) => (
            <TableRow key={game.id} className={game.won ? "text-green-400" : "text-red-400/60"}>
              <TableCell>{new Date(game.createdAt).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>{game.word}</TableCell>
              <TableCell>{game.attempts}</TableCell>
              <TableCell>{game.mode}</TableCell>
              <TableCell>{game.duration}s</TableCell>
              <TableCell>{game.xpEarned}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-zinc-800 bg-black font-mono text-xs text-zinc-500 disabled:opacity-40"
          disabled={!hasPrevious}
          onClick={() => setPage((value) => Math.max(0, value - 1))}
        >
          prev
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-zinc-800 bg-black font-mono text-xs text-zinc-500 disabled:opacity-40"
          disabled={!hasNext}
          onClick={() => setPage((value) => value + 1)}
        >
          next
        </Button>
      </div>
    </div>
  );
}
