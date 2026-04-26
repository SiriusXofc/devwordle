import Image from "next/image";
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
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <span>DEVWORDLE · MIT</span>
          <Image
            src="/brand/powered-by-squarecloud.svg"
            alt="Powered by SquareCloud"
            width={154}
            height={28}
            className="h-7 w-auto opacity-70 transition-opacity hover:opacity-100"
          />
        </div>
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
