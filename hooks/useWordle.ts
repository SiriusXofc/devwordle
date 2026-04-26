"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { STACKTRACES } from "@/lib/stacktraces";
import { WORDS } from "@/lib/words";

export type LetterResult = "correct" | "present" | "absent";
export type LetterMap = Record<string, LetterResult>;

export type Guess = {
  word: string;
  result: LetterResult[];
};

export type CompletionPayload = {
  word: string;
  attempts: number;
  won: boolean;
  duration: number;
  guesses: Guess[];
};

type UseWordleOptions = {
  wordList?: string[];
  initialTarget?: string;
  maxAttempts?: number;
  unlimitedAttempts?: boolean;
  hardMode?: boolean;
  showStacktraces?: boolean;
  onComplete?: (payload: CompletionPayload) => void;
};

const RESULT_PRIORITY: Record<LetterResult, number> = {
  absent: 0,
  present: 1,
  correct: 2,
};

function chooseTarget(wordList: string[]) {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function chooseStacktrace() {
  return STACKTRACES[Math.floor(Math.random() * STACKTRACES.length)];
}

export function checkGuess(word: string, target: string): LetterResult[] {
  const result: LetterResult[] = Array(5).fill("absent");
  const used = Array(5).fill(false);
  const letters = word.split("");
  const targetLetters = target.split("");

  letters.forEach((letter, index) => {
    if (letter === targetLetters[index]) {
      result[index] = "correct";
      used[index] = true;
    }
  });

  letters.forEach((letter, index) => {
    if (result[index] === "correct") {
      return;
    }

    const presentIndex = targetLetters.findIndex(
      (targetLetter, targetIndex) => !used[targetIndex] && targetLetter === letter,
    );

    if (presentIndex >= 0) {
      result[index] = "present";
      used[presentIndex] = true;
    }
  });

  return result;
}

function mergeLetterMap(letterMap: LetterMap, word: string, result: LetterResult[]) {
  return word.split("").reduce<LetterMap>((nextMap, letter, index) => {
    const current = nextMap[letter];
    const incoming = result[index];

    if (!current || RESULT_PRIORITY[incoming] > RESULT_PRIORITY[current]) {
      nextMap[letter] = incoming;
    }

    return nextMap;
  }, { ...letterMap });
}

function getHardModeError(guess: string, previousGuesses: Guess[]) {
  const requiredPositions = new Map<number, string>();
  const requiredLetters = new Set<string>();

  previousGuesses.forEach(({ word, result }) => {
    result.forEach((state, index) => {
      if (state === "correct") {
        requiredPositions.set(index, word[index]);
      }

      if (state === "present" || state === "correct") {
        requiredLetters.add(word[index]);
      }
    });
  });

  for (const [index, letter] of Array.from(requiredPositions.entries())) {
    if (guess[index] !== letter) {
        return `// modo difícil: "${letter}" deve estar na posição ${index + 1}.`;
    }
  }

  for (const letter of Array.from(requiredLetters.values())) {
    if (!guess.includes(letter)) {
      return `// modo difícil: "${letter}" deve estar na palavra.`;
    }
  }

  return null;
}

export function useWordle({
  wordList = WORDS,
  initialTarget,
  maxAttempts = 6,
  unlimitedAttempts = false,
  hardMode = false,
  showStacktraces = true,
  onComplete,
}: UseWordleOptions = {}) {
  const stableWordList = useMemo(() => wordList.filter((word) => word.length === 5), [wordList]);
  const [target, setTarget] = useState(initialTarget ?? chooseTarget(stableWordList));
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [letterMap, setLetterMap] = useState<LetterMap>({});
  const [stacktrace, setStacktrace] = useState<string | null>(null);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [lastSubmittedRow, setLastSubmittedRow] = useState<number | null>(null);
  const [popKey, setPopKey] = useState(0);
  const [submitKey, setSubmitKey] = useState(0);
  const startRef = useRef(Date.now());

  const attemptsUsed = guesses.length;

  const reset = useCallback(
    (nextTarget?: string) => {
      setTarget(nextTarget ?? initialTarget ?? chooseTarget(stableWordList));
      setGuesses([]);
      setCurrent("");
      setGameOver(false);
      setWon(false);
      setLetterMap({});
      setStacktrace(null);
      setValidationAlert(null);
      setShakeRow(null);
      setLastSubmittedRow(null);
      setPopKey(0);
      setSubmitKey(0);
      startRef.current = Date.now();
    },
    [initialTarget, stableWordList],
  );

  const nextRound = useCallback(() => {
    reset(chooseTarget(stableWordList));
  }, [reset, stableWordList]);

  const finishAsLoss = useCallback(() => {
    if (gameOver) {
      return;
    }

    setCurrent("");
    setWon(false);
    setGameOver(true);
    setStacktrace(null);
    setValidationAlert(null);
    onComplete?.({
      word: target,
      attempts: Math.max(guesses.length, 1),
      won: false,
      duration: Math.max(Math.round((Date.now() - startRef.current) / 1000), 1),
      guesses,
    });
  }, [gameOver, guesses, onComplete, target]);

  const dismissStacktrace = useCallback(() => {
    setStacktrace(null);
  }, []);

  const dismissValidationAlert = useCallback(() => {
    setValidationAlert(null);
  }, []);

  const shake = useCallback(() => {
    const row = unlimitedAttempts ? Math.min(guesses.length, 5) : guesses.length;
    setShakeRow(row);
    window.setTimeout(() => setShakeRow(null), 350);
  }, [guesses.length, unlimitedAttempts]);

  const addLetter = useCallback(
    (letter: string) => {
      if (gameOver || current.length >= 5 || (!unlimitedAttempts && guesses.length >= maxAttempts)) {
        return;
      }

      setCurrent((value) => `${value}${letter.toUpperCase()}`.slice(0, 5));
      setPopKey((value) => value + 1);
    },
    [current.length, gameOver, guesses.length, maxAttempts, unlimitedAttempts],
  );

  const removeLetter = useCallback(() => {
    if (gameOver) {
      return;
    }

    setCurrent((value) => value.slice(0, -1));
  }, [gameOver]);

  const submitGuess = useCallback(() => {
    if (gameOver) {
      return;
    }

    if (current.length < 5) {
      const missing = 5 - current.length;
      setValidationAlert(`> palavra incompleta — ${missing} ${missing === 1 ? "letra faltando" : "letras faltando"}.`);
      shake();
      return;
    }

    const normalized = current.toUpperCase();
    if (!/^[A-Z]{5}$/.test(normalized)) {
      setValidationAlert("> use apenas letras de A a Z.");
      shake();
      return;
    }

    const hardError = hardMode ? getHardModeError(normalized, guesses) : null;
    if (hardError) {
      setValidationAlert(hardError);
      shake();
      return;
    }

    const result = checkGuess(normalized, target);
    const nextGuesses = [...guesses, { word: normalized, result }];
    const didWin = normalized === target;
    const didLose = !unlimitedAttempts && nextGuesses.length >= maxAttempts && !didWin;

    setGuesses(nextGuesses.slice(unlimitedAttempts ? -6 : 0));
    setLetterMap((value) => mergeLetterMap(value, normalized, result));
    setCurrent("");
    setLastSubmittedRow(Math.min(guesses.length, 5));
    setSubmitKey((value) => value + 1);
    setValidationAlert(null);

    if (didWin || didLose) {
      setWon(didWin);
      setGameOver(true);
      setStacktrace(null);
      onComplete?.({
        word: target,
        attempts: nextGuesses.length,
        won: didWin,
        duration: Math.max(Math.round((Date.now() - startRef.current) / 1000), 1),
        guesses: nextGuesses,
      });
      return;
    }

    setStacktrace(showStacktraces ? chooseStacktrace() : null);
  }, [
    current,
    gameOver,
    guesses,
    hardMode,
    maxAttempts,
    onComplete,
    shake,
    showStacktraces,
    target,
    unlimitedAttempts,
  ]);

  const handleKey = useCallback(
    (key: string) => {
      if (key === "Enter" || key === "ENT") {
        submitGuess();
        return;
      }

      if (key === "Backspace" || key === "DEL") {
        removeLetter();
        return;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        addLetter(key);
      }
    },
    [addLetter, removeLetter, submitGuess],
  );

  return useMemo(
    () => ({
      target,
      guesses,
      current,
      gameOver,
      won,
      letterMap,
      stacktrace,
      validationAlert,
      shakeRow,
      lastSubmittedRow,
      popKey,
      submitKey,
      attemptsUsed,
      maxAttempts,
      addLetter,
      removeLetter,
      submitGuess,
      handleKey,
      reset,
      nextRound,
      finishAsLoss,
      dismissStacktrace,
      dismissValidationAlert,
    }),
    [
      target,
      guesses,
      current,
      gameOver,
      won,
      letterMap,
      stacktrace,
      validationAlert,
      shakeRow,
      lastSubmittedRow,
      popKey,
      submitKey,
      attemptsUsed,
      maxAttempts,
      addLetter,
      removeLetter,
      submitGuess,
      handleKey,
      reset,
      nextRound,
      finishAsLoss,
      dismissStacktrace,
      dismissValidationAlert,
    ],
  );
}
