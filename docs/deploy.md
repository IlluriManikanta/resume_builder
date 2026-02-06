# Deploy to Vercel (with Neon or Supabase)

Steps to deploy the Resume Builder to Vercel with a Postgres database.

---

## 1. Database (Neon or Supabase)

### Option A: Neon

1. Go to [neon.tech](https://neon.tech) and create an account / project.
2. Create a new project and copy the **connection string** (Postgres URL).
3. Use the **pooled** connection string for serverless (e.g. `...-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`).

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → Database**, copy the **Connection string** (URI). Use **Transaction** mode for Prisma; or **Session** if you prefer.
3. Replace the placeholder password with your database password.

---

## 2. Vercel project

1. Push your code to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
3. Framework preset: **Next.js**. Root directory: `.` (or your app root). Leave Build and Output defaults.

---

## 3. Environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Postgres connection string from Neon or Supabase |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | From [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Yes | From Clerk Dashboard (secret) |
| `OPENAI_API_KEY` | No | For AI bullet improvement |
| `NEXT_PUBLIC_AI_ENABLED` | No | Set to `true` if using OpenAI |
| `RATE_LIMIT_AI_IMPROVE_PER_DAY` | No | Default 20 |
| `RATE_LIMIT_PDF_EXPORT_PER_DAY` | No | Default 30 |

Apply to **Production**, **Preview**, and **Development** as needed.

---

## 4. Clerk production setup

1. In [Clerk Dashboard](https://dashboard.clerk.com), open your application.
2. **Configure → Paths**: ensure Sign-in URL is `/sign-in` (or match `NEXT_PUBLIC_CLERK_SIGN_IN_URL` if set).
3. **Configure → Domains**: add your Vercel domain (e.g. `your-app.vercel.app` and any custom domain).
4. Use **Production** keys for the live site; keep **Development** keys for local.

---

## 5. Database migrations

Run migrations against your production DB **before** or **right after** first deploy:

**Option A – from your machine (recommended once):**

```bash
# Use the same DATABASE_URL as in Vercel (copy from Vercel env or Neon/Supabase)
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**Option B – from Vercel build:**

Add a **Build Command** that runs migrations then build, e.g.:

```bash
npx prisma generate && npx prisma migrate deploy && next build
```

(Ensure `DATABASE_URL` is available at build time in Vercel.)

---

## 6. Deploy

1. Click **Deploy** in Vercel. Wait for the build to finish.
2. Open the deployed URL. You should be redirected to sign-in on `/dashboard` or `/resume/*` if not logged in.
3. Create a resume and save; it should persist in Postgres.

---

## 7. PDF export on Vercel (optional)

By default, **PDF export uses Playwright/Chromium**, which is **not** available on Vercel’s serverless runtime. The app will return **503** for PDF export in that case and show a friendly message in the UI.

To enable PDF export on Vercel you can:

- Use a **serverless Chromium** solution (e.g. [@sparticuz/chromium](https://github.com/Sparticuz/chromium) with `playwright-core`) and configure the PDF route to use it, or  
- Call an **external PDF API** from the export route and document the required env vars in `.env.example`.

Until then, PDF export will work locally and show a clear “not available in this environment” message when used on Vercel.

---

## Checklist

- [ ] Repo connected to Vercel  
- [ ] `DATABASE_URL` (Neon or Supabase) set in Vercel  
- [ ] Clerk keys set; production domain added in Clerk  
- [ ] `npx prisma migrate deploy` run against production DB  
- [ ] Deploy succeeds; sign-in and resume save work  
- [ ] Privacy page linked from home (`/privacy`)
