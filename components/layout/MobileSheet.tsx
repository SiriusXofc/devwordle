"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type MobileSheetProps = {
  username?: string | null;
  guestId?: string | null;
};

export function MobileSheet({ username, guestId }: MobileSheetProps) {
  const label = username ?? (guestId ? `${guestId} [GUEST]` : "offline");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-zinc-800 bg-black text-zinc-500 md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="grid gap-5 pt-8">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-zinc-600">SESSÃO</p>
            <p className="mt-1 font-mono text-sm text-green-400">{label}</p>
          </div>
          <Separator className="bg-zinc-800" />
          <div className="grid gap-3 font-mono text-sm tracking-widest">
            <Link href="/game" className="text-zinc-300 hover:text-green-400">
              JOGAR
            </Link>
            <Link href="/rank" className="text-zinc-300 hover:text-green-400">
              RANK
            </Link>
            <Link href={username ? `/profile/${username}` : "/auth"} className="text-zinc-300 hover:text-green-400">
              PERFIL
            </Link>
            <Link href="/settings" className="text-zinc-300 hover:text-green-400">
              CONFIGURAÇÕES
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
