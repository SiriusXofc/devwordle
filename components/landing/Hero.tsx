import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";

const DEMO_TILES = [
  ["R", "border-green-600 bg-green-900 text-white"],
  ["E", "border-green-600 bg-green-900 text-white"],
  ["A", "border-yellow-600 bg-yellow-900 text-white"],
  ["C", "border-zinc-800 bg-zinc-900 text-zinc-500"],
  ["T", "border-yellow-600 bg-yellow-900 text-white"],
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          <span className="inline-block h-1.5 w-1.5 animate-pulse bg-green-500" />
          terminal/devwordle/v2 - online
        </div>

        <div className="mt-6">
          <BrandLogo className="h-12 sm:h-16 md:h-20" />
        </div>

        <p className="mt-6 max-w-xl font-mono text-base leading-relaxed text-zinc-500 md:text-lg">
          Adivinhe o termo tech em 6 tentativas. Vocabulário que você usa todo dia. Em 2 minutos, você volta pro código.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/game"
            className="inline-flex items-center justify-center border border-green-500 bg-green-500 px-6 py-3 font-mono text-sm font-bold tracking-[0.18em] text-black transition-colors hover:bg-green-400"
          >
            &gt; INICIAR SESSÃO
          </Link>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center border border-zinc-800 bg-transparent px-6 py-3 font-mono text-sm font-semibold tracking-[0.18em] text-zinc-100 transition-colors hover:border-zinc-100"
          >
            JÁ TENHO CONTA
          </Link>
        </div>

        <div className="mt-10 flex gap-1">
          {DEMO_TILES.map(([letter, state], index) => (
            <span
              key={`${letter}-${index}`}
              className={`flex h-10 w-10 items-center justify-center border font-mono text-sm font-bold sm:h-12 sm:w-12 ${state}`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
