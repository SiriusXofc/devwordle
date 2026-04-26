import { Hero } from "@/components/landing/Hero";
import { ModeCards } from "@/components/landing/ModeCards";
import { RanksSection } from "@/components/landing/RanksSection";
import { TerminalShowcase } from "@/components/landing/TerminalShowcase";
import { Navbar } from "@/components/layout/Navbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-black pt-12">
      <Navbar />
      <Hero />
      <TerminalShowcase />
      <ModeCards />
      <RanksSection />
      <PublicFooter />
    </main>
  );
}
