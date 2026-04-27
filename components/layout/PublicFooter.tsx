import Link from "next/link";

const links = [
  ["JOGAR", "/game"],
  ["RANK", "/rank"],
  ["TERMOS", "/terms"],
  ["PRIVACIDADE", "/privacy"],
];

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-black">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-6 text-center font-mono text-[10px] tracking-widest text-zinc-700 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <span>DEVWORDLE · MIT</span>
        <div className="flex flex-wrap justify-center gap-4">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-green-400">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
