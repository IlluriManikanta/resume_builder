# Resume Builder — Project Summary

Full overview of what’s implemented and the current state of the app.

---

## Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript  
- **Styling:** TailwindCSS  
- **Validation / types:** Zod (resume schema, API validation)  
- **Database:** Prisma schema present (Postgres); **not connected** — resume data is in-memory only  
- **PDF:** Playwright (Chromium) for server-side PDF generation  
- **AI:** OpenAI API (gpt-4o-mini) for bullet improvement only  

No auth. No AI used for scoring (rules-based only).

---

## What’s implemented (by milestone)

### 1. Project scaffold (MVP)

- **App routes**
  - `/` — Home with link to Dashboard  
  - `/dashboard` — “New Resume” creates a resume and redirects to builder  
  - `/resume/[resumeId]/builder` — Full editor (left: sections, right: live preview)  
  - `/resume/[resumeId]/review` — Score + top 3 recommendations  
- **API**
  - `POST /api/resumes/create` — Returns new `resumeId`, stores placeholder in memory  
  - `GET /api/resumes/[resumeId]` — Returns stored resume (404 if missing)  
  - `POST /api/resumes/[resumeId]` — Saves resume JSON (in-memory)  
- **Lib**
  - `lib/store.ts` — In-memory `Map` for resumes (used by API)  
  - `lib/resume/schema.ts` — Zod schema + TS types for resume  
  - `lib/resume/defaults.ts` — Starter resume data  
  - `lib/resume/scoring.ts` — Rules-based scoring (see below)  
- **UI**
  - `components/ui/*` — Button, Input, Textarea, Card, Modal (minimal)  
  - `components/builder/BuilderShell.tsx` — Header + two-column layout, Save + Export PDF  
  - `components/builder/SectionEditors.tsx` — All section editors (see below)  
  - `components/templates/AtsTemplateV1.tsx` — ATS-style resume layout  
  - `components/templates/ResumePreview.tsx` — Wraps template in letter-size frame  
- **Docs:** `docs/mvp.md`, `docs/decisions.md`  

### 2. Structured editor UI

- **Contact:** Name, email, phone, LinkedIn, GitHub (all controlled inputs).  
- **Summary:** Single textarea.  
- **Experience:** List of entries. Each: company, role, location, start/end date; bullets with add/remove; add/remove entries.  
- **Projects:** List of projects. Each: name + bullets (add/remove bullets and projects).  
- **Education:** List of entries. Each: school (institution), degree, start/end date; add/remove entries.  
- **Skills:** One textarea; value split on commas/newlines into `string[]`.  
- All updates go to React state; preview on the right updates live. No JSON editing in the UI.

### 3. ATS template (print-perfect)

- **AtsTemplateV1:** Single-column, ATS-safe (no icons).  
- Clear section headings, consistent margins, bullet indentation, dates right-aligned.  
- **ResumePreview:** Letter-size (8.5×11) with 0.5" margins; looks like a real resume.  
- Styling is minimal and deterministic (no dynamic fonts/icons).

### 4. PDF export

- **API:** `POST /api/export/pdf` — Body: resume JSON. Returns `application/pdf` attachment.  
- **Lib:**  
  - `lib/export/renderHtml.ts` — Renders resume to self-contained HTML (same structure as ATS template, embedded CSS).  
  - `lib/export/pdf.ts` — Playwright: set HTML, `page.pdf()` Letter with 0.5" margins, returns buffer.  
- **UI:** “Export PDF” in builder header; calls API and downloads `resume.pdf`.  
- **Setup:** `npx playwright install chromium` once; no DB required.

### 5. AI bullet improvement

- **API:** `POST /api/ai/improve-bullet` — Body: `{ role, company, bullet, skills }`. Returns `{ improvedBullet }`.  
- **Lib:** `lib/ai/prompts.ts` — Prompt: improve bullet, no fake numbers; use placeholders like `[X%]` or `(quantify impact)` if metrics missing.  
- **UI:** `ImproveBulletButton` next to each bullet in Experience and Projects. “Improve” → replace bullet with API response; “Undo” restores previous text (stored locally).  
- **Env:** `OPENAI_API_KEY` required for this feature.

### 6. Rules-based resume scoring

- **Lib:** `lib/resume/scoring.ts`  
  - **Score 0–100** from rules only (no AI).  
  - **Checks:** missing sections (summary, experience, education, skills, name, email), bullet length (too short/long), action verbs at start of bullets, numbers/metrics in bullets, skills count (too few or too many).  
  - Returns `ResumeScore`: `overall` and `recommendations[]` (each with `priority`, `message`, `area`).  
  - `topRecommendations(score, 3)` for top 3.  
- **Review page:** Loads resume from `resumeStore` by `resumeId`. If found: shows **score (0–100)** with color (green/amber/red) and **top 3 actionable recommendations**; “Back to Builder” link. If not found: message to save in builder first.

---

## Current state and functionality

### Data flow

1. **Create:** Dashboard → “New Resume” → `POST /api/resumes/create` → redirect to `/resume/[resumeId]/builder`.  
2. **Edit:** Builder loads default resume from `lib/resume/defaults` into state (keyed by `resumeId`). User edits in SectionEditors; preview updates live.  
3. **Save:** “Save” → `POST /api/resumes/[resumeId]` with full resume JSON → stored in `resumeStore` (in-memory).  
4. **Review:** `/resume/[resumeId]/review` reads from `resumeStore`, validates with Zod, runs `scoreResume()`, shows score + top 3 recommendations.  
5. **Export:** “Export PDF” → `POST /api/export/pdf` with current resume from state → PDF generated via Playwright and downloaded.  
6. **Improve bullet:** “Improve” on a bullet → `POST /api/ai/improve-bullet` → bullet replaced; “Undo” restores previous text.

### What works end-to-end

- Create a resume from dashboard.  
- Full editing (contact, summary, experience, projects, education, skills) with live preview.  
- Save to in-memory store (persists until process restarts).  
- Review page: score 0–100 and top 3 recommendations (when resume was saved).  
- Export current state as PDF (Letter, 0.5" margins).  
- AI bullet improvement with Undo (when `OPENAI_API_KEY` is set).

### What’s not implemented (by design or future)

- **Auth** — None.  
- **Database** — Prisma schema exists; app uses in-memory store only.  
- **AI for scoring** — Scoring is 100% rules-based.  
- **Drag-and-drop** reorder — Not in scope.  
- **Multiple templates** — Only AtsTemplateV1.  
- **Review page “Export PDF”** — Export is in the builder only.

### Files you might edit next

- **Resume shape:** `lib/resume/schema.ts`, `lib/resume/defaults.ts`  
- **Scoring rules:** `lib/resume/scoring.ts`  
- **Editor UI:** `components/builder/SectionEditors.tsx`  
- **Preview/template:** `components/templates/AtsTemplateV1.tsx`, `ResumePreview.tsx`  
- **PDF content:** `lib/export/renderHtml.ts`  
- **AI prompt:** `lib/ai/prompts.ts`  
- **Persistence:** Replace `lib/store` usage in API routes with Prisma + Postgres when ready.

---

## Commands

```bash
npm install
npx playwright install chromium   # once, for PDF
npm run dev                        # http://localhost:3000
```

Optional for AI bullet improvement: set `OPENAI_API_KEY` in `.env.local`.

---

## Doc references

- **MVP scope:** `docs/mvp.md`  
- **Decisions (store, schema, UI):** `docs/decisions.md`  
- **This summary:** `docs/project-summary.md`
