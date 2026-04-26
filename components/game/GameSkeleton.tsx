export function GameSkeleton() {
  return (
    <div className="mx-auto grid w-fit gap-1 animate-in fade-in duration-300">
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }).map((__, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className="h-[clamp(40px,11vw,52px)] w-[clamp(40px,11vw,52px)] animate-pulse border border-zinc-900 bg-black"
              style={{ opacity: 1 - rowIndex * 0.1 - columnIndex * 0.01 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
