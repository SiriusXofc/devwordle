const LINES = [
  ["$", "whoami", "text-green-400"],
  [">", "dev sobrecarregado, precisando de pausa", "text-zinc-500"],
  ["$", "devwordle --start", "text-green-400"],
  [">", "sessao aberta. boa sorte.", "text-green-400"],
] as const;

const GUESS_ROW = [
  ["R", "correct"],
  ["E", "correct"],
  ["A", "present"],
  ["C", "absent"],
  ["T", "present"],
] as const;

function Tile({ letter, state }: { letter: string; state: string }) {
  const cls =
    state === "correct"
      ? "border-green-600 bg-green-900 text-white"
      : state === "present"
        ? "border-yellow-600 bg-yellow-900 text-white"
        : "border-zinc-800 bg-zinc-900 text-zinc-500";

  return <div className={`flex h-9 w-9 items-center justify-center border font-mono text-sm font-bold md:h-11 md:w-11 ${cls}`}>{letter}</div>;
}

export function TerminalShowcase() {
  return (
    <section className="border-b border-zinc-900">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600"># showcase</p>
          <h2 className="mt-3 font-mono text-3xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            QUEM PROGRAMA
            <br />
            <span className="text-zinc-600">PRECISA DE</span>
            <br />
            INTERVALO BOM.
          </h2>
          <p className="mt-5 max-w-md font-mono text-sm leading-relaxed text-zinc-500 md:text-base">
            Quando o teste não passa, o lint reclama e você precisa parar de olhar pro editor por dois minutos, isso é o DevWordle.
          </p>

          <ul className="mt-6 space-y-2 font-mono text-xs tracking-wider text-zinc-500">
            <li>&gt; <span className="text-zinc-100">2 minutos</span> e você volta pro código</li>
            <li>&gt; <span className="text-zinc-100">sem login</span> obrigatório</li>
            <li>&gt; <span className="text-zinc-100">sem ad</span>, sem distração</li>
          </ul>
        </div>

        <div className="border border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-800 bg-black px-3 py-2">
            <span className="h-2.5 w-2.5 border border-zinc-800" />
            <span className="h-2.5 w-2.5 border border-zinc-800" />
            <span className="h-2.5 w-2.5 border border-green-500 bg-green-950" />
            <span className="ml-3 font-mono text-[10px] tracking-[0.25em] text-zinc-600">~ /devwordle/session</span>
          </div>
          <div className="space-y-1.5 p-5 font-mono text-xs leading-relaxed md:p-7 md:text-sm">
            {LINES.map(([prompt, content, color], index) => (
              <div key={index} className="flex gap-3">
                <span className={color}>{prompt}</span>
                <span className="text-zinc-100/90">{content}</span>
              </div>
            ))}
            <div className="mt-5 flex gap-1.5">
              {GUESS_ROW.map(([letter, state], index) => (
                <Tile key={index} letter={letter} state={state} />
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <span className="text-green-400">$</span>
              <span className="text-zinc-100">_</span>
              <span className="h-4 w-[2px] animate-cursor bg-green-500" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
