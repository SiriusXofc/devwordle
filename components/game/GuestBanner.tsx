"use client";

import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function GuestBanner() {
  return (
    <Alert className="animate-in fade-in slide-in-from-top-2 rounded-none border-green-800 bg-green-950/30 p-3 text-green-300 duration-300">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-widest">[GUEST] progresso não salvo</span>
        <Button asChild variant="outline" className="h-8 border-green-800 bg-black text-[10px] text-green-400">
          <Link href="/auth">CRIAR CONTA</Link>
        </Button>
      </div>
    </Alert>
  );
}
