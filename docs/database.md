# Database setup (Postgres + Prisma)

Resumes are stored in Postgres. You need a running database and env configured.

## 1. Environment

Copy the example env and set your connection string:

```bash
cp .env.example .env.local
# Edit .env.local and set DATABASE_URL to your Postgres URL
```

Example:

```
DATABASE_URL="postgresql://user:password@localhost:5432/resume_builder?schema=public"
```

## 2. Migrate and generate client

From the project root:

```bash
npx prisma migrate dev
npx prisma generate
```

- `prisma migrate dev` creates/updates the database schema and creates a migration.
- `prisma generate` generates the Prisma Client (run after schema changes).

## 3. Run the app

```bash
npm run dev
```

Create a resume from the dashboard; it will be persisted in Postgres and survive server restarts.
