import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="border border-zinc-900 bg-black px-4 py-10 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">&gt; {title}</p>
      <p className="mt-3 font-mono text-sm text-zinc-500">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex border border-green-800 px-4 py-2 font-mono text-[10px] tracking-widest text-green-400 hover:bg-green-950"
        >
          &gt; {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
