import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { PageHeader } from "@/components/shared/PageHeader";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const user = await getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: { username: true, email: true },
  });

  return (
    <main className="min-h-screen bg-black pt-12">
      <Navbar />
      <div className="mx-auto grid w-full max-w-3xl gap-5 px-3 py-8">
        <PageHeader label="settings" title="CONFIGURACOES" description="controle conta, preferencias do jogo e zona de perigo sem sair do terminal." />
        <SettingsPanel initialUsername={user?.username ?? ""} initialEmail={user?.email ?? ""} />
      </div>
    </main>
  );
}
