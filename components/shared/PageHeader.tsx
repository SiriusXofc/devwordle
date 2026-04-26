import { SectionLabel } from "@/components/shared/SectionLabel";

export function PageHeader({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <header className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <SectionLabel>{label}</SectionLabel>
      <h1 className="mt-2 font-mono text-2xl font-semibold tracking-[0.18em] text-green-400 sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-zinc-500">{description}</p>
    </header>
  );
}
