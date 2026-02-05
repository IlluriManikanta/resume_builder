# MVP Resume Builder

## Goal

Minimal working scaffold: create and edit a resume in the browser with in-memory persistence. No auth, no AI, no PDF export yet.

## Scope

- **Pages**: Home, Dashboard, Builder (`/resume/[id]/builder`), Review (`/resume/[id]/review`)
- **API**: `POST /api/resumes/create` (returns new `resumeId`), `GET/POST /api/resumes/[resumeId]` (in-memory store for now)
- **Editor**: Left panel = section editors (contact, summary, skills); right panel = live preview
- **Save**: POST resume JSON to `/api/resumes/[resumeId]`; stored in memory (no DB required to run)

## Tech

- Next.js 14 App Router, TypeScript, TailwindCSS
- Zod for resume schema and types
- Prisma schema present; DB calls stubbed (in-memory map used instead until DB is connected)

## Next steps (post-MVP)

- Connect Prisma to Postgres and persist resumes
- Auth (e.g. NextAuth)
- PDF export
- AI suggestions (optional)
