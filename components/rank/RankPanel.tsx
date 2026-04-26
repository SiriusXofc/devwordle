"use client";

import { useState } from "react";
import { LeaderboardTable } from "@/components/rank/LeaderboardTable";
import { TerminalCard } from "@/components/shared/TerminalCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RankUser = {
  id: string;
  username: string;
  xp: number;
  totalWins: number;
  totalGames: number;
  currentStreak: number;
};

type RankPanelProps = {
  users: RankUser[];
  weeklyUsers: RankUser[];
  byMode: Record<string, RankUser[]>;
  currentUserId: string;
};

export function RankPanel({ users, weeklyUsers, byMode, currentUserId }: RankPanelProps) {
  const [mode, setMode] = useState("ALL");
  const activeUsers = mode === "ALL" ? users : byMode[mode] ?? [];
  const activeWeeklyUsers = mode === "ALL" ? weeklyUsers : byMode[mode]?.filter((user) => weeklyUsers.some((weekly) => weekly.id === user.id)) ?? [];

  return (
    <TerminalCard className="p-5">
      <Tabs defaultValue="global" className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="global">GLOBAL</TabsTrigger>
            <TabsTrigger value="weekly">SEMANAL</TabsTrigger>
            <TabsTrigger value="friends">AMIGOS</TabsTrigger>
          </TabsList>
          <div className="w-full sm:w-48">
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">TODOS OS MODOS</SelectItem>
                <SelectItem value="CLASSIC">CLASSIC</SelectItem>
                <SelectItem value="SPEED">SPEED</SelectItem>
                <SelectItem value="HARD">HARD</SelectItem>
                <SelectItem value="DAILY">DAILY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="global">
          <LeaderboardTable users={activeUsers} currentUserId={currentUserId} />
        </TabsContent>
        <TabsContent value="weekly">
          <LeaderboardTable users={activeWeeklyUsers} currentUserId={currentUserId} emptyLabel="RANK SEMANAL VAZIO" />
        </TabsContent>
        <TabsContent value="friends">
          <LeaderboardTable users={[]} currentUserId={currentUserId} emptyLabel="AMIGOS EM BREVE" />
        </TabsContent>
      </Tabs>
    </TerminalCard>
  );
}
