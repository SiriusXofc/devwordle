import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3000"),
  title: "DevWordle",
  description: "Um Wordle futurista para termos tech, ranks e desafios diários.",
  openGraph: {
    title: "DevWordle",
    description: "Adivinhe termos tech em uma plataforma futurista.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("dark", jetBrainsMono.variable)}>
      <body className="min-h-screen overflow-x-hidden bg-black font-mono">
        <div className="w-full max-w-[100vw] overflow-x-hidden">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
