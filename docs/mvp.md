# MVP Resume Builder

## Goal

Minimal working scaffold: create and edit a resume in the browser with in-memory persistence. No auth, no AI, no PDF export yet.

## Scope

- **Pages**: Home, Dashboard, Builder (`/resume/[id]/builder`), Review (`/resume/[id]/review`)
- **API**: `POST /api/resumes/create` (returns new `resumeId`), `GET/POST /api/resumes/[resumeId]` (Postgres via Prisma)
- **Editor**: Left panel = section editors (contact, summary, skills); right panel = live preview
- **Save**: POST resume JSON to `/api/resumes/[resumeId]`; stored in Postgres (see `docs/database.md`)

## Tech

- Next.js 14 App Router, TypeScript, TailwindCSS
- Zod for resume schema and types
- Prisma + Postgres for resume persistence

## Next steps (post-MVP)

- Auth (e.g. NextAuth)
- PDF export
- AI suggestions (optional)
