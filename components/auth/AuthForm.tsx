"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("> email inválido"),
  password: z.string().min(8, "// min: 8 chars"),
});

const registerSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, "mínimo de 3 caracteres")
    .max(20, "máximo de 20 caracteres")
    .regex(/^[a-z0-9_]+$/, "use minúsculas, números e underscore"),
});

type AuthFormProps = {
  mode: "login" | "register";
};

type AuthValues = {
  username?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const schema = mode === "register" ? registerSchema : loginSchema;
  const form = useForm<AuthValues>({
    resolver: zodResolver(schema),
    defaultValues: mode === "register" ? { username: "", email: "", password: "" } : { email: "", password: "" },
  });

  async function onSubmit(values: AuthValues) {
    setServerError("");

    if (mode === "register") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setServerError(body.error ?? "não foi possível criar a conta");
        return;
      }
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("usuário ou senha incorretos");
      return;
    }

    window.localStorage.removeItem("devwordle_guest");
    toast(mode === "register" ? "> sessão criada. bem-vindo ao terminal." : "> acesso liberado.", {
      description: values.email,
    });
    router.push("/game");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {mode === "register" ? (
          <FormField
            control={form.control}
            name={"username" as never}
            render={({ field }) => (
              <FormItem>
                <FormLabel>USERNAME</FormLabel>
                <FormControl>
                  <Input maxLength={20} autoComplete="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name={"email" as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel>EMAIL</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"password" as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SENHA</FormLabel>
              <FormControl>
                <Input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError ? (
          <Alert className="rounded-none border-red-800 border-l-2 border-l-red-500 bg-red-950/50 p-3">
            <p className="font-mono text-[10px] tracking-widest text-red-300">&gt; erro 401: {serverError}</p>
          </Alert>
        ) : null}
        <Button
          type="submit"
          variant="outline"
          className="h-11 rounded-none border-green-800 bg-black font-mono text-[11px] tracking-widest text-green-400 hover:bg-green-950"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "> autenticando..." : mode === "register" ? "> CRIAR CONTA" : "> ENTRAR"}
        </Button>
      </form>
    </Form>
  );
}
