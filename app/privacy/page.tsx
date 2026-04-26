import { LegalPage } from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="POLÍTICA DE PRIVACIDADE"
      sections={[
        { title: "DADOS COLETADOS", body: ["Coletamos username, email, senha protegida por hash e dados das partidas."] },
        { title: "COMO USAMOS OS DADOS", body: ["Usamos os dados para autenticação, ranking, histórico, estatísticas e preferências."] },
        { title: "CONTA E AUTENTICAÇÃO", body: ["A autenticação usa sessão segura e credenciais verificadas no servidor."] },
        { title: "DADOS DE JOGO", body: ["Salvamos palavra, modo, tentativas, resultado, duração e XP para contas autenticadas."] },
        { title: "COOKIES E LOCALSTORAGE", body: ["Convidados usam localStorage para ID temporário e preferências locais do jogo."] },
        { title: "SEGURANÇA", body: ["Senhas não são armazenadas em texto puro. APIs sensíveis verificam sessão no servidor."] },
        { title: "RETENÇÃO DE DADOS", body: ["Dados de conta e partidas permanecem enquanto a conta existir."] },
        { title: "DIREITOS DO USUÁRIO", body: ["Você pode solicitar atualização ou remoção dos seus dados de conta."] },
        { title: "CONTATO", body: ["Dúvidas de privacidade podem ser enviadas para privacy@devwordle.app."] },
      ]}
    />
  );
}
