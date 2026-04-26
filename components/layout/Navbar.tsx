"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { MobileSheet } from "@/components/layout/MobileSheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "INÍCIO" },
  { href: "/game", label: "JOGAR" },
  { href: "/rank", label: "RANK" },
  { href: "/profile", label: "PERFIL" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [guestId, setGuestId] = useState<string | null>(null);
  const username = session?.user?.username;

  useEffect(() => {
    setGuestId(window.localStorage.getItem("devwordle_guest"));
  }, []);

  const initials = (username ?? guestId ?? "DW").slice(0, 2).toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-12 border-b border-zinc-900 bg-black">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-3">
        <Link href="/" className="flex items-center">
          <BrandLogo className="hidden h-7 sm:block" />
          <BrandLogo compact className="h-8 sm:hidden" />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {links.map((link) => {
              const href = link.href === "/profile" ? (username ? `/profile/${username}` : "/auth") : link.href;
              const active = pathname === href || (link.href === "/profile" && pathname.startsWith("/profile"));

              return (
                <NavigationMenuItem key={link.label}>
                  <Link
                    href={href}
                    className={cn(
                      "border-b border-transparent pb-1 font-mono text-[11px] tracking-widest text-zinc-600 hover:text-green-400",
                      active && "border-green-500 text-green-400",
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {!username && guestId ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden border-green-800 bg-black font-mono text-[10px] text-green-400 hover:bg-green-950 sm:inline-flex"
              onClick={() => router.push("/auth")}
            >
              CRIAR CONTA
            </Button>
          ) : null}

          {username ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-800 bg-green-950 text-green-400">
                  {initials}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/profile/${username}`)}>MEU PERFIL</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/profile/${username}?tab=stats`)}>ESTATÍSTICAS</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>CONFIGURAÇÕES</DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 h-px bg-zinc-800" />
                <DropdownMenuItem className="text-red-400" onClick={() => signOut({ callbackUrl: "/auth" })}>
                  SAIR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !guestId ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden border-green-800 bg-black font-mono text-[10px] text-green-400 hover:bg-green-950 sm:inline-flex"
              onClick={() => router.push("/auth")}
            >
              ENTRAR
            </Button>
          ) : null}
          <MobileSheet username={username} guestId={guestId} />
        </div>
      </div>
    </header>
  );
}
