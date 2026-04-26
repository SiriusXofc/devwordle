# Security Policy

## Reporting

If you find a vulnerability, please do not open a public issue with exploit details. Contact the maintainer privately first.

## Secrets

Never commit:

- `.env`
- `.env.local`
- database files
- tokens
- OAuth/client secrets
- production logs

If a secret leaks, rotate it immediately. Do not rely on deleting the file from the latest commit.

## Production Checklist

- Use a strong `NEXTAUTH_SECRET`
- Set `NEXTAUTH_URL` to the production domain
- Use PostgreSQL in production
- Configure Redis/Upstash rate limiting
- Run Prisma migrations before release
- Keep dependencies updated
- Run `npm run lint` and `npm run build` before deployment
