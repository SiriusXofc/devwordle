"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function randomGuestId() {
  return `guest_${Math.random().toString(36).slice(2, 8)}`;
}

export function GuestButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full rounded-none border-green-800 bg-black font-mono text-[11px] tracking-widest text-green-400 hover:bg-green-950"
      onClick={() => {
        const guestId = randomGuestId();
        window.localStorage.setItem("devwordle_guest", guestId);
        window.localStorage.setItem("devwordle_guest_games", "0");
        toast("> modo visita. progresso local apenas.", { description: guestId });
        router.push("/game");
      }}
    >
      &gt; JOGAR AGORA
    </Button>
  );
}
