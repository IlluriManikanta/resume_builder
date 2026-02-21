/**
 * AI prompts for resume improvement.
 * Structure: role, constraints, and task are separate for maintainability and
 * future extensions (e.g. system/user split, scoring pass, role-specific tuning).
 *
 * Test examples (input → expected style, not exact output):
 *   "Built dashboard" → "Architected React dashboard serving [N] daily users, reducing load time by [X%] through lazy loading."
 *   "Worked on API" → "Designed RESTful API with [N] endpoints, enabling [feature] and cutting response latency by [X ms]."
 *   "Helped with deployment" → "Automated CI/CD pipeline deploying [N] services to AWS, reducing release cycle from [X days] to [Y hours]."
 */

export interface ImproveBulletContext {
  role: string;
  company: string;
  bullet: string;
  skills: string[];
}

/** Role definition for improve-bullet (identity; keep short for later tuning). */
const IMPROVE_BULLET_ROLE =
  "You are a senior resume coach who transforms vague bullets into high-signal achievement statements.";

/**
 * Constraints the model must follow.
 * Anti-paraphrase + signal gain + no filler + placeholders + length.
 */
const IMPROVE_BULLET_CONSTRAINTS = `Constraints (you MUST follow all):

1. NO PARAPHRASING: Do NOT merely swap synonyms or lightly reword. The output must be structurally different from the input and add concrete information.

2. SIGNAL GAIN: The rewritten bullet must add at least 2 of the following when possible:
   - Scope/scale (team size, user count, data volume, systems affected)
   - Measurable impact (percentage improvement, time saved, revenue, cost reduction)
   - Technical mechanism or architecture (tools, patterns, infrastructure)
   - Outcome/business value (why it mattered, what it enabled)

3. NO GENERIC FILLER: Never use weak phrases like "worked on", "responsible for", "helped with", "utilized", "assisted in", "involved in". Use strong action verbs that show ownership.

4. NO INVENTED METRICS: Do NOT invent numbers, percentages, or specific tools not implied by the input. If metrics are missing, use placeholders: [X%], [N users], [Y ms], [$Z], [time period].

5. ONE BULLET ONLY: Output exactly one bullet point. No paragraphs, no multiple bullets, no lists. Resume-friendly length (~15-30 words).

6. Keep any metrics/numbers from the original exactly as stated.`;

/** Output format and task instruction. */
const IMPROVE_BULLET_TASK =
  "Return ONLY the improved bullet point text. No explanations, no markdown, no quotes, no bullet character. Just the text.";

/**
 * Builds the context block (Role, Company, Current bullet, Relevant skills) for improve-bullet.
 */
function buildImproveBulletContextBlock(context: ImproveBulletContext): string {
  const { role, company, bullet, skills } = context;
  const skillsList = skills.length > 0 ? skills.join(", ") : "general skills";
  return `- Role: ${role || "(not specified)"}
- Company: ${company || "(not specified)"}
- Current bullet: ${bullet}
- Relevant skills: ${skillsList}`;
}

/**
 * Prompt for improving a resume bullet point (single user message format).
 * Kept for backwards compatibility; prefer getImproveBulletMessages() for system/user split.
 */
export function buildImproveBulletPrompt(context: ImproveBulletContext): string {
  const contextBlock = buildImproveBulletContextBlock(context);
  return `${IMPROVE_BULLET_ROLE}

Context:
${contextBlock}

${IMPROVE_BULLET_CONSTRAINTS}

${IMPROVE_BULLET_TASK}`;
}

/** Message parts for improve-bullet (for system/user split). */
export interface ImproveBulletMessageParts {
  role: string;
  constraints: string;
  task: string;
}

export function getImproveBulletMessageParts(): ImproveBulletMessageParts {
  return {
    role: IMPROVE_BULLET_ROLE,
    constraints: IMPROVE_BULLET_CONSTRAINTS,
    task: IMPROVE_BULLET_TASK,
  };
}

/** OpenAI chat message shape. */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Returns messages array for system/user split (preferred for better constraint adherence).
 * System: role + constraints. User: context + task.
 */
export function getImproveBulletMessages(context: ImproveBulletContext): ChatMessage[] {
  const contextBlock = buildImproveBulletContextBlock(context);
  const systemContent = `${IMPROVE_BULLET_ROLE}\n\n${IMPROVE_BULLET_CONSTRAINTS}`;
  const userContent = `Context:\n${contextBlock}\n\nTask: ${IMPROVE_BULLET_TASK}`;
  return [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];
}

// TODO: Optional scoring pass — score current bullet (e.g. 1–5) and only call improve when below threshold; or return score + improved bullet for UI.
// TODO: Variation control — support multiple strategies (e.g. 'add metrics', 'add scope', 'cause-effect') or temperature/seed for reproducible variants.
