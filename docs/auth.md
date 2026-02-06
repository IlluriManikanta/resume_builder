# Auth (Clerk + Google)

- **Clerk** handles sign-in and route protection. Enable **Google** in the [Clerk Dashboard](https://dashboard.clerk.com) under **User & Authentication → Social connections**.
- **Env:** Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local` (see `.env.example`). If these are not set, the app runs without auth (routes are not protected, API returns 401 for resume endpoints).
- **Protected routes:** When Clerk is configured, `/dashboard` and `/resume/*` require sign-in; unauthenticated users are redirected to `/sign-in`.
- **Data:** Resumes are scoped by `userId` (Clerk user id). Create sets `userId`; GET/POST/list only return or update resumes owned by the current user.
- **Migration:** After pulling the schema change, run `npx prisma migrate dev --name add_user_id` to add the `userId` column.

## Rate limiting

- **AI improve:** 20 requests/day/user (configurable via `RATE_LIMIT_AI_IMPROVE_PER_DAY`).
- **PDF export:** 30 exports/day/user (configurable via `RATE_LIMIT_PDF_EXPORT_PER_DAY`).
- Counts are stored in the `DailyUsage` table (one row per user per day). Run `npx prisma migrate dev` after adding the model.
- When the limit is exceeded, the API returns **429** with JSON: `{ error, limit, current, retryAfter: "tomorrow" }`.
