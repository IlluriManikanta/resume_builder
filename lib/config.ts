/**
 * Server: true if NEXT_PUBLIC_AI_ENABLED or OPENAI_API_KEY is set.
 * Client: only NEXT_PUBLIC_AI_ENABLED is available (OPENAI_API_KEY is never exposed).
 * Set NEXT_PUBLIC_AI_ENABLED=true in .env.local when you have configured OPENAI_API_KEY.
 */
export const AI_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_AI_ENABLED ?? process.env.OPENAI_API_KEY
);
