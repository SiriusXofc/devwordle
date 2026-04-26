# DevWordle

DevWordle is a futuristic Wordle-style game for developer vocabulary. Guess 5-letter tech terms, earn XP, climb ranks, and play different modes with a terminal-inspired interface.

## Features

- Classic, Speed, Hard, and Daily modes
- XP and rank progression
- Auth with credentials and guest mode
- Profile, stats, game history, and leaderboard
- Prisma database schema with game records and daily completion protection
- Server-side validation for games, cooldowns, and anti-farm rules
- Sharp terminal UI with JetBrains Mono, black background, and green accent

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- NextAuth credentials provider
- Prisma
- SQLite for local development

## Local Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open:

```txt
http://127.0.0.1:3000
```

## Environment Variables

Use `.env.example` as the template.

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

Generate a local secret with:

```bash
openssl rand -base64 32
```

Never commit `.env`, database files, logs, `.next`, or local build artifacts.

## Production Notes

For production, use a managed PostgreSQL database instead of SQLite and configure all environment variables in the hosting provider.

Recommended production services:

- Database: Neon, Supabase, Railway, or another PostgreSQL provider
- Rate limit: Upstash Redis via `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Hosting: Vercel or another Next.js-compatible platform

Before deploying:

```bash
npm run lint
npm run build
```

## Security

This repository intentionally ignores local secrets and runtime artifacts. If a secret was ever committed, rotate it immediately in the deployment provider.

Sensitive files that must stay private:

- `.env`
- `.env.local`
- `prisma/dev.db`
- build artifacts
- logs

## License

MIT
