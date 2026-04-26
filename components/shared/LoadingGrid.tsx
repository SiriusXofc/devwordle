export function LoadingGrid({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid w-fit gap-1">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }).map((__, col) => (
            <div
              key={`${row}-${col}`}
              className="h-11 w-11 animate-pulse border border-zinc-800 bg-zinc-950 sm:h-12 sm:w-12"
              style={{ animationDelay: `${(row + col) * 35}ms`, opacity: 1 - row * 0.08 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
