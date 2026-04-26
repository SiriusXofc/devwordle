"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DailyShare } from "@/components/game/DailyShare";
import { GameGrid } from "@/components/game/GameGrid";
import { GameHeader } from "@/components/game/GameHeader";
import { GameKeyboard } from "@/components/game/GameKeyboard";
import { GameOverPanel } from "@/components/game/GameOverPanel";
import { GameSidePanel } from "@/components/game/GameSidePanel";
import { GuestBanner } from "@/components/game/GuestBanner";
import { HintButton } from "@/components/game/HintButton";
import { ModeSelector } from "@/components/game/ModeSelector";
import { SessionPanel } from "@/components/game/SessionPanel";
import { SpeedTimer } from "@/components/game/SpeedTimer";
import { StacktraceAlert } from "@/components/game/StacktraceAlert";
import { Navbar } from "@/components/layout/Navbar";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useGuestId } from "@/hooks/useGuestId";
import { useSound } from "@/hooks/useSound";
import { useTimer } from "@/hooks/useTimer";
import { useWordle, type CompletionPayload } from "@/hooks/useWordle";
import { getDailyKey, getDailyWord, getNextDailyMs } from "@/lib/daily";
import type { GameMode } from "@/lib/gameModes";
import { getSeniority } from "@/lib/seniority";
import { calculateXp } from "@/lib/xp";
import { getWordHint, getWordsByMode } from "@/lib/words";

function meterColor(attempts: number, maxAttempts: number) {
  const ratio = Math.min(Math.max(attempts / maxAttempts, 0), 1);
  const green = { r: 34, g: 197, b: 94 };
  const red = { r: 239, g: 68, b: 68 };
  const r = Math.round(green.r + (red.r - green.r) * ratio);
  const g = Math.round(green.g + (red.g - green.g) * ratio);
  const b = Math.round(green.b + (red.b - green.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

const WIN_MESSAGES: Record<number, string> = {
  1: "> sem debug. sem lint. one shot.",
  2: "> 2 commits. palavra em prod.",
  3: "> 3 tentativas. passou no CI.",
  4: "> 4 tentativas. entregue antes do sprint.",
  5: "> 5 tentativas. quase era um hotfix.",
  6: "> última tentativa. git push --force.",
};

export function GameBoard({ mode = "CLASSIC" }: { mode?: GameMode }) {
  const { data: session, status: sessionStatus } = useSession();
  const guestId = useGuestId();
  const [hint, setHint] = useState<{ category: string; hint: string } | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [dailyBlocked, setDailyBlocked] = useState(false);
  const [dailyCountdown, setDailyCountdown] = useState("");
  const [speedDone, setSpeedDone] = useState(false);
  const [showStacktraces, setShowStacktraces] = useState(true);
  const [sounds, setSounds] = useState(false);
  const playClick = useSound(sounds);
  const previousMode = useRef(mode);
  const speedRemainingRef = useRef(90);

  useEffect(() => {
    setShowStacktraces(window.localStorage.getItem("devwordle_stacktraces") !== "off");
    setSounds(window.localStorage.getItem("devwordle_sounds") === "on");
  }, []);

  useEffect(() => {
    if (mode !== "DAILY") {
      return;
    }

    const interval = window.setInterval(() => setDailyCountdown(formatCountdown(getNextDailyMs())), 1000);
    setDailyCountdown(formatCountdown(getNextDailyMs()));
    return () => window.clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (mode !== "DAILY") {
      return;
    }

    if (guestId || sessionStatus === "unauthenticated") {
      setDailyBlocked(true);
      return;
    }

    if (sessionStatus === "loading") {
      return;
    }

    setDailyBlocked(window.localStorage.getItem(`devwordle_daily_${getDailyKey()}`) === "done");
  }, [guestId, mode, sessionStatus]);

  const wordList = getWordsByMode(mode);
  const dailyWord = mode === "DAILY" ? getDailyWord() : undefined;

  const recordGame = useCallback(
    async (payload: CompletionPayload) => {
      const xp = calculateXp({
        won: payload.won,
        attempts: payload.attempts,
        mode,
        hintUsed,
        timeRemaining: mode === "SPEED" ? speedRemainingRef.current : 0,
      });

      if (guestId) {
        const games = Number(window.localStorage.getItem("devwordle_guest_games") ?? "0") + 1;
        window.localStorage.setItem("devwordle_guest_games", String(games));
        if (games >= 3) {
          toast("> crie uma conta para salvar seu progresso", {
            description: "rank, streak e histórico ficam salvos na sua conta",
            action: { label: "CRIAR CONTA", onClick: () => (window.location.href = "/auth") },
          });
        }
        return;
      }

      if (!session?.user?.id) {
        return;
      }

      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: payload.word,
          attempts: payload.attempts,
          won: payload.won,
          mode,
          duration: payload.duration,
          timeRemaining: mode === "SPEED" ? speedRemainingRef.current : undefined,
          guesses: payload.guesses,
          hintUsed,
        }),
      });

      if (response.ok) {
        const body = (await response.json()) as { xpEarned: number; rank: string };
        toast(`+${body.xpEarned} XP`, { duration: 2000 });
        if (body.rank) {
          toast.success(`${body.rank} desbloqueado!`);
        }
      } else {
        toast.error("> falha ao salvar partida. tente novamente.");
      }

      if (mode === "DAILY") {
        window.localStorage.setItem(`devwordle_daily_${getDailyKey()}`, "done");
        setShareOpen(true);
      }
    },
    [guestId, hintUsed, mode, session?.user?.id],
  );

  const game = useWordle({
    wordList,
    initialTarget: dailyWord,
    maxAttempts: mode === "HARD" ? 4 : 6,
    hardMode: mode === "HARD",
    showStacktraces,
    onComplete: recordGame,
  });

  const { remaining, reset: resetTimer } = useTimer(
    90,
    mode === "SPEED" && !speedDone && !game.gameOver,
    useCallback(() => {
      setSpeedDone(true);
      game.finishAsLoss();
      toast("> timeout. fim da sessão speed.");
    }, [game]),
  );

  useEffect(() => {
    speedRemainingRef.current = remaining;
  }, [remaining]);

  useEffect(() => {
    if (!game.stacktrace) {
      return;
    }

    const timeout = window.setTimeout(game.dismissStacktrace, 5000);
    return () => window.clearTimeout(timeout);
  }, [game.stacktrace, game.dismissStacktrace]);

  useEffect(() => {
    if (!game.validationAlert) {
      return;
    }

    const timeout = window.setTimeout(game.dismissValidationAlert, 3500);
    return () => window.clearTimeout(timeout);
  }, [game.validationAlert, game.dismissValidationAlert]);

  const blocked = dailyBlocked || speedDone;
  const seniority = game.won ? getSeniority(Math.min(game.attemptsUsed, 6)) : null;
  const answerHint = getWordHint(game.target);
  const hintLocked = mode === "HARD";
  const hintAvailableAfter = mode === "SPEED" ? 3 : 4;
  const attemptsUntilHint = hintLocked ? 0 : Math.max(hintAvailableAfter - game.attemptsUsed, 0);

  const resetGame = useCallback(() => {
    setHint(null);
    setHintUsed(false);
    setSpeedDone(false);
    resetTimer();
    game.reset();
  }, [game, resetTimer]);

  useEffect(() => {
    if (previousMode.current === mode) {
      return;
    }

    previousMode.current = mode;
    resetGame();
  }, [mode, resetGame]);

  const handleKey = useCallback(
    (key: string) => {
      const normalized = key.toUpperCase();

      if (normalized === "N" && (game.gameOver || speedDone)) {
        resetGame();
        return;
      }

      if (!hintLocked && normalized === "H" && !hint && game.attemptsUsed >= hintAvailableAfter && !game.gameOver) {
        setHint(answerHint);
        setHintUsed(true);
        return;
      }

      if (blocked) {
        return;
      }

      playClick();
      game.handleKey(key);
    },
    [answerHint, blocked, game, hint, hintAvailableAfter, hintLocked, resetGame, speedDone, playClick],
  );
  useKeyboard(handleKey);

  return (
    <main className="min-h-screen bg-black pt-12">
      <Navbar />
      <div className="mx-auto grid min-h-[calc(100dvh-3rem)] w-full max-w-[860px] justify-center justify-items-center gap-4 px-3 py-6 sm:px-5 lg:grid-cols-[460px_320px] lg:items-start lg:gap-8">
        <section className="grid w-full max-w-[460px] gap-4">
          {guestId ? <GuestBanner /> : null}

          <Card
            variant="outline"
            className="relative w-full animate-in overflow-hidden rounded-none border-zinc-800 bg-black shadow-none before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-green-500 before:opacity-40 fade-in slide-in-from-bottom-3 duration-500"
          >
            <CardContent className="grid gap-4 p-4 sm:p-5">
      {mode === "SPEED" ? <SpeedTimer remaining={remaining} /> : null}
              <GameHeader />

              <ModeSelector mode={mode} dirty={!game.gameOver && (game.current.length > 0 || game.guesses.length > 0)} />
              <Separator className="bg-green-500/20" />

              {dailyBlocked ? (
                <Alert className="animate-in fade-in slide-in-from-top-2 rounded-none border-zinc-800 bg-zinc-950 p-3 duration-300">
                  <p className="font-mono text-xs text-zinc-400">
                    {guestId || sessionStatus === "unauthenticated"
                      ? "daily exige conta registrada. convidados jogam clássico ou speed."
                      : "daily concluído. volte amanhã."}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-600">próximo desafio em {dailyCountdown}</p>
                </Alert>
              ) : null}

              <div className="relative grid justify-center gap-3 animate-in fade-in zoom-in-95 duration-500">
                {game.validationAlert ? (
                  <Alert className="absolute left-1/2 top-2 z-20 w-[min(100%,360px)] -translate-x-1/2 animate-in fade-in slide-in-from-top-2 rounded-none border-red-800 border-l-2 border-l-red-500 bg-red-950/90 p-3 text-red-300 duration-200">
                    <p className="font-mono text-[10px] tracking-widest text-red-400">{game.validationAlert}</p>
                  </Alert>
                ) : null}
                <GameGrid
                  guesses={game.guesses}
                  current={game.current}
                  shakeRow={game.shakeRow}
                  lastSubmittedRow={game.lastSubmittedRow}
                  popKey={game.popKey}
                  submitKey={game.submitKey}
                  won={game.won}
                  gameOver={game.gameOver}
                />
                <Progress
                  value={(Math.min(game.attemptsUsed, game.maxAttempts) / game.maxAttempts) * 100}
                  className="mx-auto h-1 w-full max-w-[calc((clamp(40px,11vw,52px)*5)+16px)] rounded-none bg-zinc-900"
                  indicatorClassName="rounded-none"
                  indicatorStyle={{ backgroundColor: meterColor(game.attemptsUsed, game.maxAttempts) }}
                />
              </div>

              {game.stacktrace ? <StacktraceAlert stacktrace={game.stacktrace} /> : null}

              <HintButton
                visible={!hintLocked && !game.gameOver && game.attemptsUsed >= hintAvailableAfter}
                hint={hint}
                category={answerHint.category}
                attemptsUntilVisible={!hintLocked && !game.gameOver ? attemptsUntilHint : 0}
                onClick={() => {
                  setHint(answerHint);
                  setHintUsed(true);
                }}
              />

              {game.gameOver || speedDone ? (
                <GameOverPanel
                  mode={mode}
                  won={game.won}
                  target={game.target}
                  attemptsUsed={game.attemptsUsed}
                  seniority={seniority}
                  winMessage={WIN_MESSAGES[Math.min(game.attemptsUsed, 6)]}
                  guesses={game.guesses}
                  onReset={resetGame}
                />
              ) : (
                <SessionPanel attemptsUsed={game.attemptsUsed} maxAttempts={game.maxAttempts} mode={mode} />
              )}

              <GameKeyboard letterMap={game.letterMap} onKey={handleKey} disabled={blocked || game.gameOver} />
            </CardContent>
          </Card>
          <footer className="text-center font-mono text-[9px] text-zinc-800">
            DEVWORDLE - MIT - {process.env.NEXT_PUBLIC_GITHUB_URL ?? "github.com/devwordle"}
          </footer>
        </section>
        <GameSidePanel mode={mode} hint={hint} attemptsUntilHint={attemptsUntilHint} hintLocked={hintLocked} />
      </div>
      <DailyShare open={shareOpen} onOpenChange={setShareOpen} guesses={game.guesses} won={game.won} />
    </main>
  );
}
