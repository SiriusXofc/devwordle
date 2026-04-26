"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TerminalCard } from "@/components/shared/TerminalCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { getRankByXp } from "@/lib/rank";

type ProfileCardProps = {
  user: {
    username: string;
    avatar: string | null;
    bio: string | null;
    createdAt: string | Date;
    currentStreak: number;
    bestStreak: number;
    totalGames: number;
    totalWins: number;
    avgAttempts: number;
    xp: number;
  };
  ownProfile: boolean;
};

export function ProfileCard({ user, ownProfile }: ProfileCardProps) {
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? user.username.slice(0, 2).toUpperCase());
  const [saving, setSaving] = useState(false);
  const rank = getRankByXp(user.xp);

  return (
    <TerminalCard className="grid gap-4 p-5">
        <div className="flex items-center gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-none border border-green-800 bg-green-950 font-mono text-green-400"
            style={{ fontSize: "clamp(20px, 5vw, 32px)", lineHeight: 1 }}
          >
            {avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-xl text-zinc-100">{user.username}</h1>
              <Badge
                variant="outline"
                className="border-zinc-700 bg-transparent font-mono text-[10px]"
                style={{ color: rank.color, textShadow: rank.code === "10X" ? "0 0 12px rgba(255,255,255,0.5)" : undefined }}
              >
                [{rank.code}]
              </Badge>
            </div>
            <p className="mt-1 font-mono text-[10px] text-zinc-600">
              membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {ownProfile ? (
          <div className="grid gap-2">
            <Label>AVATAR</Label>
            <Input
              value={avatar}
              maxLength={4}
              placeholder="emoji ou iniciais"
              onChange={(event) => setAvatar(event.target.value)}
            />
            <Label>BIO</Label>
            <Textarea
              value={bio}
              maxLength={180}
              placeholder="conte algo sobre seu stack, seu editor ou sua obsessão por cache"
              onChange={(event) => setBio(event.target.value)}
            />
            <Button
              variant="outline"
              className="rounded-none border-green-800 bg-black font-mono text-[10px] text-green-400 hover:bg-green-950"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                await fetch(`/api/profile/${user.username}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ bio, avatar }),
                });
                setSaving(false);
                toast("perfil atualizado");
              }}
            >
              SALVAR BIO
            </Button>
          </div>
        ) : (
          <p className="font-mono text-sm text-zinc-500">{bio || "sem bio"}</p>
        )}

        <div className="flex justify-between font-mono text-xs text-zinc-400">
          <span>streak atual: {user.currentStreak}</span>
          <span>melhor: {user.bestStreak}</span>
        </div>
        <Separator className="bg-zinc-800" />
        <StatsGrid totalGames={user.totalGames} totalWins={user.totalWins} avgAttempts={user.avgAttempts} xp={user.xp} />
    </TerminalCard>
  );
}
