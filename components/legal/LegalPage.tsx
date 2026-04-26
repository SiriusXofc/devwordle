import { Navbar } from "@/components/layout/Navbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { TerminalCard } from "@/components/shared/TerminalCard";

type LegalPageProps = {
  title: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-black pt-12">
      <Navbar />
      <section className="mx-auto grid w-full max-w-3xl gap-5 px-3 py-10">
        <div>
          <SectionLabel>documento legal</SectionLabel>
          <h1 className="mt-2 font-mono text-2xl tracking-[0.22em] text-green-400">{title}</h1>
          <p className="mt-3 font-mono text-sm leading-6 text-zinc-500">
            texto claro, direto e separado por secoes para consulta rapida.
          </p>
        </div>
        <TerminalCard className="p-5 sm:p-8">
          <div className="grid gap-8">
            {sections.map((section) => (
              <section key={section.title} className="grid gap-2">
                <SectionLabel className="text-zinc-300">{section.title}</SectionLabel>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="font-mono text-sm leading-7 text-zinc-500">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </TerminalCard>
      </section>
      <PublicFooter />
    </main>
  );
}
