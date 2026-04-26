import { LegalPage } from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="TERMOS DE USO"
      sections={[
        { title: "ACEITAÇÃO DOS TERMOS", body: ["Ao acessar ou usar o DevWordle, você concorda com estes termos."] },
        { title: "CONTA E ACESSO", body: ["Você é responsável por manter seus dados de acesso seguros e atualizados."] },
        { title: "MODO CONVIDADO", body: ["O modo convidado usa localStorage e não salva progresso no ranking global."] },
        { title: "RANKING E ESTATÍSTICAS", body: ["Partidas autenticadas podem gerar XP, streaks e histórico público no perfil."] },
        { title: "USO PERMITIDO", body: ["Não use automações abusivas, ataques ou tentativas de manipular ranking."] },
        { title: "LIMITAÇÃO DE RESPONSABILIDADE", body: ["O serviço é fornecido como jogo experimental, sem garantias de disponibilidade contínua."] },
        { title: "ALTERAÇÕES NOS TERMOS", body: ["Estes termos podem ser atualizados para refletir mudanças do produto."] },
        { title: "CONTATO", body: ["Dúvidas podem ser enviadas para hello@devwordle.app."] },
      ]}
    />
  );
}
