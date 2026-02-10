---
name: Resume Builder Codebase Walkthrough
overview: "A factual inventory of the ResVamp resume builder: what is implemented and working, what is wired end-to-end vs partial or placeholder, and how auth, data, AI, and deployment behave today."
todos: []
isProject: false
---

# Resume Builder — Full Codebase Walkthrough

This is a factual inventory of the current state. No speculation; no proposed features.

---

## 1. Tech stack (from code)

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** TailwindCSS; UI primitives in [components/ui/](components/ui/) (Button, Input, Textarea, Card, Modal)
- **Auth:** Clerk (`@clerk/nextjs`). Wraps app in [app/layout.tsx](app/layout.tsx) when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- **Database:** Prisma + PostgreSQL. Schema in [prisma/schema.prisma](prisma/schema.prisma): `Resume` (id, userId, title, data JSON, timestamps) and `DailyUsage` (userId, date, aiImproveCount, pdfExportCount) for rate limiting
- **Resume validation:** Zod schema in [lib/resume/schema.ts](lib/resume/schema.ts); types used across API and UI
- **PDF:** Playwright (Chromium) in [lib/export/pdf.ts](lib/export/pdf.ts); HTML from [lib/export/renderHtml.ts](lib/export/renderHtml.ts)
- **AI:** OpenAI `gpt-4o-mini` used only for bullet improvement; prompt in [lib/ai/prompts.ts](lib/ai/prompts.ts)

The in-memory store in [lib/store.ts](lib/store.ts) is **deprecated** and not used; all resume and rate-limit persistence goes through Prisma/Postgres.

---

## 2. User journey: landing → login → usage

### Landing page (`/`)

- **Route:** [app/page.tsx](app/page.tsx) — single scrollable page built from landing components.
- **Navbar** ([components/landing/navbar.tsx](components/landing/navbar.tsx)): “Log in” → `/sign-in` (or `/dashboard` if signed in); “Get Started Free” → `/sign-in`. In-page links: #features, #analysis, #templates, #pricing.
- **Hero** ([components/landing/hero.tsx](components/landing/hero.tsx)): “Start Free with ResVamp” → if signed in calls `signOut()` then navigates to `/sign-in`; otherwise goes to `/sign-in`.
- **Value Props, Feature Bar, Social Proof, Templates, Pricing, Final CTA, Footer:** Presentational. CTAs that look like primary actions:
  - **Resume Analysis** ([components/landing/resume-analysis.tsx](components/landing/resume-analysis.tsx)): “Analyze My Resume” → `handleForceSignIn()` (sign out + `/sign-in`).
  - **Upload Score** ([components/landing/upload-score.tsx](components/landing/upload-score.tsx)): “Upload Resume” → same (no actual upload/analysis).
  - **Pricing** ([components/landing/pricing.tsx](components/landing/pricing.tsx)): Plan CTAs open a modal; modal button → `handleForceSignIn()` (no checkout).
- **Intentional placeholders on landing:**
  - Resume Analysis: score ring and “Strengths / Improvement” copy are **hardcoded** (no real analysis).
  - Upload Score: category scores cycle through **fake arrays**; no file upload or scoring.
  - Templates: “View Templates” is **disabled**; only one template exists in the app.
  - Final CTA: “Customer Reviews” are **static copy** (no data source).
  - Feature bar: text only; no links.

So: every primary CTA on the landing page leads to **sign-in** (or dashboard if already signed in). No payment, no upload, no real analysis.

### Sign-in (`/sign-in`)

- **Route:** [app/sign-in/[[...sign-in]]/page.tsx](app/sign-in/[[...sign-in]]/page.tsx).
- If **Clerk is not configured** (no `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`): page shows “Sign-in is disabled until Clerk is configured” and “Back to home”.
- If **Clerk is configured:** Renders [components/auth/sign-in-card.tsx](components/auth/sign-in-card.tsx). Already-signed-in users are redirected to `/dashboard`. Card offers “Continue with Google” and “Continue with Microsoft” via Clerk OAuth redirect; “Back to home” → `/`. Terms/Privacy link to `/privacy`.

### Auth and route protection

- **Middleware** ([middleware.ts](middleware.ts)): Uses `createRouteMatcher` for `/dashboard(.*)` and `/resume(.*)`. If `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set, those routes require auth and redirect unauthenticated users to `/sign-in`. If the key is **not** set, middleware does **not** protect; API routes still return 401 when `userId` is missing.
- **API auth:** All resume, PDF, and AI routes use `auth()` from Clerk; missing `userId` → 401. So with Clerk disabled, dashboard/builder may load (no redirect) but API calls fail.

### Dashboard (`/dashboard`)

- **Route:** [app/dashboard/page.tsx](app/dashboard/page.tsx) (client component).
- **Data:** On load, `GET /api/resumes` populates `resumes` state (list of `{ id, title, updatedAt }`). Create resume: `POST /api/resumes/create` → receives `resumeId` → redirects to `/resume/[resumeId]/builder`.
- **UI:**
  - **Header:** “Create New” → create resume + redirect; Notifications button has **no handler** (placeholder). UserButton (Clerk) with sign-out to `/`.
  - **Sidebar** ([components/dashboard/sidebar.tsx](components/dashboard/sidebar.tsx)): “Overview”, “Resumes” → `/dashboard`; “Cover Letters”, “AI Review”, “Templates”, “Settings” → `#` (inactive).
  - **Progress card** ([components/dashboard/progress-card.tsx](components/dashboard/progress-card.tsx)): Static checklist (“Create your first resume” done, “Run an AI review” / “Generate a cover letter” not done). “Start AI Review” → `/dashboard`; “Create Cover Letter” button has **no onClick**.
  - **KPI strip:** Shows resume count, “Cover Letters: 0”, review count, and “Avg Score” (dashboard passes `avgScore: 85` when `resumes.length > 0`, else `null` — **not** derived from real scores).
  - **Insights** ([components/dashboard/insights.tsx](components/dashboard/insights.tsx)): **Hardcoded** benchmark chart and “Score Breakdown” (e.g. 34/40, 18/20); “How to improve” / “View full breakdown” → `/dashboard`.
  - **Action cards** ([components/dashboard/action-cards.tsx](components/dashboard/action-cards.tsx)):
    - “Resume Builder” → if `resumeId` exists, link to builder; else button “Open Builder” creates resume and redirects.
    - “Cover Letter Studio” → “Generate” runs `handleAction("cover")` which has **no implementation** (no navigation, no API); effectively inactive.
    - “AI Review” → if `resumeId` exists, link to `/resume/[resumeId]/review`; else creates a resume then redirects to builder (does **not** go to review).
  - **Widgets** ([components/dashboard/widgets.tsx](components/dashboard/widgets.tsx)): “Weekly Goals” and “Quick Tip” are **static**. “Edit Resume” link works when `resumeId` is set. Refresh tip button has **no onClick**.
  - **Recent documents** ([components/dashboard/recent-documents.tsx](components/dashboard/recent-documents.tsx)): Table of up to 5 resumes from `resumes`; each row links to `/resume/[id]/builder`. Score column always shows “--” (score is never fetched or passed).

So: dashboard is **functional** for listing resumes, creating one, and jumping to builder or (when a resume exists) to review. Cover letter, notifications, settings, templates, and real score/insights are **not** wired.

### Builder (`/resume/[resumeId]/builder`)

- **Route:** [app/resume/[resumeId]/builder/page.tsx](app/resume/[resumeId]/builder/page.tsx) (client).
- **Critical gap — load behavior:** State is initialized with `defaultResume` from [lib/resume/defaults.ts](lib/resume/defaults.ts) plus `resumeId`. There is **no `GET /api/resumes/[resumeId]**` on mount. So opening an **existing** resume (e.g. from Recent Documents or dashboard “Open Builder”) always shows the **default template**, not the saved data. Only **Save** uses the API (`POST /api/resumes/[resumeId]`).
- **UI:** [components/builder/BuilderShell.tsx](components/builder/BuilderShell.tsx): Header with “← Dashboard”, “Review score” (link to `/resume/[resumeId]/review`), Export PDF button, Save button; UserButton when Clerk is set. Two columns: left = [SectionEditors](components/builder/SectionEditors.tsx), right = [ResumePreview](components/templates/ResumePreview.tsx) wrapping [AtsTemplateV1](components/templates/AtsTemplateV1.tsx). Editing updates React state; preview is live. Save sends current state to API; no loading of existing resume.
- **Sections edited:** Contact (name, email, phone, LinkedIn, GitHub), Summary, Experience (entries with company, role, location, dates, bullets), Projects (name + bullets), Education, Skills (textarea parsed to array). All backed by [lib/resume/schema.ts](lib/resume/schema.ts).
- **Improve bullet:** [ImproveBulletButton](components/builder/ImproveBulletButton.tsx) appears next to Experience and Project bullets. Uses `AI_ENABLED` from [lib/config.ts](lib/config.ts) (true when `NEXT_PUBLIC_AI_ENABLED` or `OPENAI_API_KEY` is set). If enabled: POST to `/api/ai/improve-bullet` with role, company, bullet, skills; on success replaces bullet and offers “Undo”. Handles 429 (rate limit) and shows message. If AI not enabled, button is disabled and shows “AI improvement disabled until OPENAI_API_KEY is configured.”

### Review page (`/resume/[resumeId]/review`)

- **Route:** [app/resume/[resumeId]/review/page.tsx](app/resume/[resumeId]/review/page.tsx) (server component).
- **Data:** Loads resume from Prisma by `resumeId` and `userId`. If not found or invalid: shows “Resume not found / Save your resume in the builder first.” If found: runs rules-based `scoreResume()` and `topRecommendations(..., 3)` from [lib/resume/scoring.ts](lib/resume/scoring.ts).
- **UI:** Score 0–100 with color (green ≥70, amber ≥50, red &lt;50); list of top 3 recommendations (area + message). “Back to Builder” → builder. There is **no** Export PDF on this page (export exists only in builder).

### Privacy

- **Route:** [app/privacy/page.tsx](app/privacy/page.tsx). Static content (data usage, no selling, Clerk, AI/OpenAI). “Back to home” → `/`.

---

## 3. Backend APIs — what they do

| Endpoint                  | Method | Auth           | Behavior                                                                                                                                                                                                                                                             |
| ------------------------- | ------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/resumes`            | GET    | Clerk `userId` | List resumes for user (id, title, updatedAt). 401 if not signed in.                                                                                                                                                                                                  |
| `/api/resumes/create`     | POST   | Clerk `userId` | Creates row in Postgres with `defaultResume` JSON; returns `{ resumeId }`. 401 if not signed in.                                                                                                                                                                     |
| `/api/resumes/[resumeId]` | GET    | Clerk `userId` | Returns stored `data` for that resume if owned by user; 404 otherwise. **Not called by builder on load.**                                                                                                                                                            |
| `/api/resumes/[resumeId]` | POST   | Clerk `userId` | Validates body with Zod; updates `data` for that resume if owned by user. 400 on invalid data, 404 if not found.                                                                                                                                                     |
| `/api/export/pdf`         | POST   | Clerk `userId` | Rate-limited (DailyUsage, default 30/day). Body = resume JSON; renders HTML via [lib/export/renderHtml.ts](lib/export/renderHtml.ts), then [lib/export/pdf.ts](lib/export/pdf.ts) (Playwright). Returns PDF or 503 if Chromium unavailable (e.g. Vercel serverless). |
| `/api/ai/improve-bullet`  | POST   | Clerk `userId` | Rate-limited (DailyUsage, default 20/day). Body: role, company, bullet, skills. Calls OpenAI; returns `{ improvedBullet }`. 400 if `OPENAI_API_KEY` missing.                                                                                                         |

All resume and feature APIs are **user-scoped** via Clerk `userId`. Rate limits use Prisma `DailyUsage` (per user per day).

---

## 4. Authentication and data persistence

- **Auth:** Clerk only. When publishable key is set: layout wraps app in `ClerkProvider`; middleware protects `/dashboard` and `/resume/*`; sign-in page shows Google/Microsoft OAuth. Without the key: no provider, no route protection, APIs still return 401 for resume/export/AI.
- **Persistence:** 100% Prisma/Postgres. Resumes: `Resume` table. Rate limits: `DailyUsage`. No in-memory store in use. If `DATABASE_URL` is missing or wrong, create/save/list and rate limits will fail at runtime.
- **Docs:** [docs/auth.md](docs/auth.md) and [docs/database.md](docs/database.md) describe Clerk, env vars, and migrations. [docs/deploy.md](docs/deploy.md) covers Vercel, Neon/Supabase, Clerk production domains, and that PDF export is not available on Vercel by default (Playwright/Chromium).

---

## 5. AI and automation — live vs not

- **Live:** **AI bullet improvement** only. Client calls `/api/ai/improve-bullet`; server uses OpenAI `gpt-4o-mini` and [lib/ai/prompts.ts](lib/ai/prompts.ts). Requires `OPENAI_API_KEY`; optional `NEXT_PUBLIC_AI_ENABLED=true` to show/enable the Improve button. Rate-limited per user per day.
- **Not AI / not implemented:** Resume **scoring** is **rules-based** in [lib/resume/scoring.ts](lib/resume/scoring.ts) (missing sections, bullet length, action verbs, numbers, skills count). No AI for analysis, scoring, or cover letters. No upload-and-analyze flow; landing “Analyze” and “Upload” CTAs only send users to sign-in.

---

## 6. Deployment and environment assumptions

- **Build:** `prisma generate && next build` (see [package.json](package.json)). Migrations must be run separately (e.g. `prisma migrate deploy`) for DB.
- **Env (from [.env.example](.env.example)):** `DATABASE_URL` (required for persistence and rate limits), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (required for auth and protection). Optional: `OPENAI_API_KEY`, `NEXT_PUBLIC_AI_ENABLED`, `RATE_LIMIT_AI_IMPROVE_PER_DAY`, `RATE_LIMIT_PDF_EXPORT_PER_DAY`.
- **Vercel:** Deploy doc states PDF export returns 503 on serverless (no Chromium); suggests serverless Chromium or external PDF API for production. Resumes and auth are designed to work with Neon/Supabase + Clerk once env and migrations are set.

---

## 7. Summary tables

**Fully wired end-to-end**

- Landing → Sign-in (with Clerk) → Dashboard
- Create resume (POST create → redirect to builder)
- Edit resume in builder (state + live preview); Save (POST resume by id)
- Export PDF from builder (with rate limit and 503 when Chromium missing)
- AI bullet improve (with rate limit and optional env)
- Review page: load saved resume from DB, show rules-based score + top 3 recommendations, Back to Builder
- Recent documents: list from API; links to builder (but builder does not load that resume’s data on open)

**Partially implemented or broken**

- **Builder load:** Does not fetch existing resume; opening an existing resume always shows default template until the user saves again (then they would overwrite with current default-based state if they don’t re-enter data).
- **Dashboard:** KPI “Avg Score” is hardcoded (85 when any resumes exist). Insights and Progress are static. “AI Review” link goes to review only when a resume exists; “Cover Letter” and “Start AI Review” / “Create Cover Letter” do not implement real flows.
- **Recent documents:** Score column always “--”; no API or data for per-resume score on list.

**Intentionally inactive / placeholder**

- Landing: “Upload Resume”, “Analyze My Resume”, “View Templates”, pricing plan CTAs (only send to sign-in); “Customer Reviews” static.
- Dashboard: Cover Letters, AI Review (sidebar), Templates, Settings (sidebar); Notifications; “Create Cover Letter” button; “Start AI Review” (links to dashboard); Insights and Progress content.
- Templates: Only AtsTemplateV1; “View Templates” disabled on landing.

**Missing or stubbed**

- Builder: No GET on mount for `/api/resumes/[resumeId]` (existing resume not loaded).
- Cover letter: No routes, no UI flow, no API.
- Real per-resume score on dashboard or recent docs list.
- PDF export on review page (by design per docs).
- Notifications, settings, multiple templates, payment/checkout.

This is the current state of the project as reflected in the code and docs.
