# Cloudinary SaaS

Next.js app with:

- Clerk authentication
- Cloudinary image/video upload
- Prisma + PostgreSQL for video metadata

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env template:

```bash
# macOS/Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

3. Fill all values in `.env.local`.

4. Apply database migrations:

```bash
npx prisma migrate deploy
```

5. Run dev server:

```bash
npm run dev
```

## Required Environment Variables

Use `.env.example` as the source of truth.

- `DATABASE_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (recommended: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (recommended: `/sign-up`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (recommended: `/home`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` (recommended: `/home`)

## Deploy With Clerk (Vercel)

1. Push your repository to GitHub.

2. In Clerk Dashboard:
- Create/select your application.
- Set sign-in URL to `/sign-in` and sign-up URL to `/sign-up`.
- Add your production domain in Allowed Origins/Redirect URLs.

3. In Vercel:
- Import the repository.
- Add all environment variables from `.env.example` (with real values).
- Ensure both Preview and Production environments get the values.

4. Deploy.

5. After first deploy, run migrations against production DB:

```bash
npx prisma migrate deploy
```

## Build Command

The project build command is already configured in `package.json`:

```bash
npm run build
```

It runs:

```bash
prisma generate && next build
```

## Troubleshooting

- If auth pages fail, re-check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
- If upload APIs fail, re-check Cloudinary keys.
- If API routes fail on DB access, verify `DATABASE_URL` and run Prisma migrations.
