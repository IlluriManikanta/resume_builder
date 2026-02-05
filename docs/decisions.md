# Decisions

## In-memory store for MVP

Resumes are stored in a shared `Map` in `lib/store.ts` and used by the API routes. This allows the app to run with `npm run dev` without a database. When ready, we will switch to Prisma + Postgres using the existing `prisma/schema.prisma`.

## Resume schema (Zod)

Single source of truth in `lib/resume/schema.ts`. Exported TypeScript types are inferred from Zod. Default starter data lives in `lib/resume/defaults.ts`.

## Builder UI

- No drag-and-drop in MVP; simple form sections (Contact, Summary, Skills) with live preview.
- Experience and Education sections are rendered in the template but editing is deferred to a later iteration (or add minimal list editors if time permits).

## Templates

`AtsTemplateV1` is the first template (ATS-friendly, minimal styling). `ResumePreview` wraps it and can later switch templates or add more.
