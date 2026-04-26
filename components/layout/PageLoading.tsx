import { Navbar } from "@/components/layout/Navbar";

export function PageLoading({ rows = 1 }: { rows?: number }) {
  return (
    <main className="min-h-screen bg-black pt-12">
      <Navbar />
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-3 pt-4">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-600">
          <span className="h-4 w-[2px] animate-cursor bg-green-500" />
          carregando sessao...
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 animate-pulse border border-zinc-800 bg-zinc-950" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-64 animate-pulse border border-zinc-800 bg-zinc-950" />
        ))}
      </div>
    </main>
  );
}
