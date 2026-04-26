"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { TerminalCard } from "@/components/shared/TerminalCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type SettingsPanelProps = {
  initialUsername: string;
  initialEmail: string;
};

export function SettingsPanel({ initialUsername, initialEmail }: SettingsPanelProps) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);
  const [stacktraces, setStacktraces] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [accent, setAccent] = useState("Verde");

  useEffect(() => {
    setStacktraces(window.localStorage.getItem("devwordle_stacktraces") !== "off");
    setSounds(window.localStorage.getItem("devwordle_sounds") === "on");
    setAccent(window.localStorage.getItem("devwordle_accent") ?? "Verde");
  }, []);

  function setAccentColor(value: string) {
    setAccent(value);
    window.localStorage.setItem("devwordle_accent", value);
    const colors: Record<string, string> = {
      Verde: "142.1 70.6% 45.3%",
      Azul: "213.3 93.9% 67.8%",
      Roxo: "263.4 69.3% 72.2%",
      Laranja: "24.6 95% 53.1%",
    };
    const hsl = colors[value] ?? colors.Verde;
    document.documentElement.style.setProperty("--primary", hsl);
    document.documentElement.style.setProperty("--accent", hsl);
    document.documentElement.style.setProperty("--ring", hsl);
  }

  async function handleSaveAccount() {
    setSavingAccount(true);
    const response = await fetch("/api/settings/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });
    setSavingAccount(false);

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      toast.error(body.error ?? "erro ao salvar conta");
      return;
    }

    const body = (await response.json()) as { error?: string; requireReauth?: boolean };

    if (body.requireReauth) {
      toast.success("> credencial alterada. faça login novamente.");
      await signOut({ callbackUrl: "/auth" });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("> conta atualizada.");
  }

  async function handleDeleteAccount() {
    const response = await fetch("/api/settings/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: deletePassword }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      toast.error(body.error ?? "erro ao deletar conta");
      return;
    }

    toast.success("> conta deletada. até mais.");
    await signOut({ callbackUrl: "/auth" });
  }

  return (
    <TerminalCard className="p-5">
      <div className="grid gap-6">
        <section className="grid gap-3">
          <SectionLabel className="text-green-400">CONTA</SectionLabel>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>USERNAME</Label>
              <Input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="novo username" />
            </div>
            <div className="grid gap-2">
              <Label>EMAIL</Label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="novo email" />
            </div>
          </div>
          <details className="border border-zinc-800 bg-black p-3">
            <summary className="cursor-pointer font-mono text-[10px] tracking-widest text-zinc-500">ALTERAR SENHA</summary>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="grid gap-2">
                <Label>SENHA ATUAL</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="senha atual"
                />
              </div>
              <div className="grid gap-2">
                <Label>NOVA SENHA</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="mínimo 8 caracteres"
                />
              </div>
              <div className="grid gap-2">
                <Label>CONFIRMAR SENHA</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="repita a nova senha"
                />
              </div>
            </div>
          </details>
          <Button
            variant="outline"
            className="w-fit border-green-800 bg-black font-mono text-xs text-green-400 hover:bg-green-950 disabled:opacity-50"
            onClick={handleSaveAccount}
            disabled={savingAccount}
          >
            {savingAccount ? "SALVANDO..." : "> SALVAR CONTA"}
          </Button>
        </section>

        <Separator className="bg-zinc-800" />

        <section className="grid gap-4">
          <SectionLabel className="text-green-400">PREFERÊNCIAS</SectionLabel>
          <div className="flex items-center justify-between gap-4">
            <Label>stacktraces no jogo</Label>
            <Switch
              checked={stacktraces}
              onCheckedChange={(checked) => {
                setStacktraces(checked);
                window.localStorage.setItem("devwordle_stacktraces", checked ? "on" : "off");
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label>sons de teclado</Label>
            <Switch
              checked={sounds}
              onCheckedChange={(checked) => {
                setSounds(checked);
                window.localStorage.setItem("devwordle_sounds", checked ? "on" : "off");
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>cor de acento</Label>
            <Select value={accent} onValueChange={setAccentColor}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verde">Verde</SelectItem>
                <SelectItem value="Azul">Azul</SelectItem>
                <SelectItem value="Roxo">Roxo</SelectItem>
                <SelectItem value="Laranja">Laranja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <Separator className="bg-zinc-800" />

        <section className="grid gap-3">
          <SectionLabel className="text-red-400">PERIGO</SectionLabel>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-fit font-mono text-xs">
                DELETAR CONTA
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>DELETAR CONTA?</AlertDialogTitle>
                <AlertDialogDescription>ação irreversível. jogos, rank e streak serão apagados permanentemente.</AlertDialogDescription>
                <div className="grid gap-2 pt-2">
                  <Label>SENHA ATUAL</Label>
                  <Input
                    type="password"
                    value={deletePassword}
                    onChange={(event) => setDeletePassword(event.target.value)}
                    placeholder="confirme sua senha"
                  />
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-800 bg-black text-zinc-300">CANCELAR</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white"
                  onClick={handleDeleteAccount}
                >
                  CONFIRMAR
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </TerminalCard>
  );
}
