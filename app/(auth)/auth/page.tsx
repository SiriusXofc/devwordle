import { AuthForm } from "@/components/auth/AuthForm";
import { GuestButton } from "@/components/auth/GuestButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const accessLog = [
  "checking credentials provider",
  "guest sandbox available",
  "rank persistence requires account",
  "daily challenge locked behind session",
];

export default function AuthPage() {
  return (
    <main className="grid min-h-screen bg-black p-3 sm:p-6 lg:grid-cols-[1fr_420px]">
      <section className="hidden border border-zinc-900 p-8 lg:grid lg:content-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-green-400">ACCESS_NODE</p>
          <h1 className="mt-5 max-w-3xl font-mono text-5xl font-semibold leading-tight tracking-[0.14em] text-zinc-100">
            ENTRE, OU JOGUE NO ESCURO.
          </h1>
          <p className="mt-5 max-w-xl font-mono text-sm leading-7 text-zinc-500">
            Conta salva XP, streak, histórico e rank. Convidado joga rápido, mas some quando o cache for embora.
          </p>
        </div>

        <div className="grid gap-3 border border-zinc-900 bg-zinc-950/30 p-5">
          <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-600">AUTH_LOG</p>
          {accessLog.map((line) => (
            <p key={line} className="font-mono text-xs text-zinc-500">
              <span className="text-green-400">&gt;</span> {line}
            </p>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center border border-zinc-900 bg-zinc-950/20 p-4">
        <div className="w-full max-w-sm">
          <div className="mb-5 text-center">
            <div className="inline-flex items-center gap-2">
              <h2 className="font-mono text-xl tracking-[0.3em] text-green-400">DEVWORDLE</h2>
              <span className="h-[14px] w-[2px] animate-cursor bg-green-500" />
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-widest text-zinc-600">/auth/session</p>
          </div>

          <div className="border border-zinc-800 bg-black p-5">
            <Tabs defaultValue="login">
              <TabsList className="w-full">
                <TabsTrigger value="login">ENTRAR</TabsTrigger>
                <TabsTrigger value="register">CRIAR</TabsTrigger>
                <TabsTrigger value="guest">VISITA</TabsTrigger>
              </TabsList>

              <div className="my-4 grid grid-cols-5 gap-1">
                {["T", "O", "K", "E", "N"].map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className="flex h-8 items-center justify-center border border-zinc-900 font-mono text-[10px] text-zinc-500"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <TabsContent value="login">
                <AuthForm mode="login" />
              </TabsContent>
              <TabsContent value="register">
                <AuthForm mode="register" />
              </TabsContent>
              <TabsContent value="guest">
                <div className="grid gap-3">
                  <p className="font-mono text-xs leading-relaxed text-zinc-500">
                    entra sem conta. joga agora. não salva rank, streak nem histórico.
                  </p>
                  <div className="grid gap-1 border border-zinc-900 bg-zinc-950/40 p-3 font-mono text-[10px] text-zinc-600">
                    <span>&gt; acesso completo ao jogo</span>
                    <span>&gt; ranking desativado</span>
                    <span>&gt; histórico local apenas</span>
                  </div>
                  <GuestButton />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  );
}
