-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,
    "bio" TEXT DEFAULT '',
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "totalWins" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastWonAt" DATETIME,
    "avgAttempts" REAL NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT 'INICIANTE'
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "won" BOOLEAN NOT NULL,
    "mode" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "timeRemaining" INTEGER,
    "difficulty" TEXT,
    "category" TEXT,
    "guesses" TEXT,
    "xpEarned" INTEGER NOT NULL,
    "hintUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_xp_idx" ON "User"("xp");
CREATE INDEX "Game_userId_idx" ON "Game"("userId");
CREATE INDEX "Game_userId_createdAt_idx" ON "Game"("userId", "createdAt");
CREATE INDEX "Game_mode_idx" ON "Game"("mode");
CREATE INDEX "Game_createdAt_idx" ON "Game"("createdAt");
CREATE UNIQUE INDEX "DailyCompletion_userId_date_key" ON "DailyCompletion"("userId", "date");
CREATE INDEX "DailyCompletion_userId_idx" ON "DailyCompletion"("userId");
