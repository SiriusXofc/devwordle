export function GameHeader() {
  return (
    <div className="flex flex-col gap-3 px-1">
      <div>
        <div className="flex items-center gap-2">
          <h1
            className="font-mono text-xl font-medium tracking-[0.3em] text-green-400"
            style={{ textShadow: "0 0 20px rgba(34,197,94,0.3)" }}
          >
            DEVWORDLE
          </h1>
          <span className="h-[14px] w-[2px] animate-cursor bg-green-500" />
        </div>
        <p className="mt-0.5 text-[10px] tracking-widest text-zinc-600">ADIVINHE O TERMO TECH</p>
      </div>
    </div>
  );
}
