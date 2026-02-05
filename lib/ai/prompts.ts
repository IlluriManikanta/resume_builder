/**
 * AI prompts for resume improvement.
 */

export interface ImproveBulletContext {
  role: string;
  company: string;
  bullet: string;
  skills: string[];
}

/**
 * Prompt for improving a resume bullet point.
 * Emphasizes: no fake numbers, use placeholders if metrics are missing.
 */
export function buildImproveBulletPrompt(context: ImproveBulletContext): string {
  const { role, company, bullet, skills } = context;
  const skillsList = skills.length > 0 ? skills.join(", ") : "general skills";

  return `You are a resume writing expert. Improve this resume bullet point to be more impactful and ATS-friendly.

Context:
- Role: ${role || "(not specified)"}
- Company: ${company || "(not specified)"}
- Current bullet: ${bullet}
- Relevant skills: ${skillsList}

Requirements:
1. Make it more specific and impactful
2. Use action verbs (e.g., "Led", "Built", "Improved", "Reduced")
3. If metrics/numbers are mentioned in the original, keep them exactly as stated
4. If metrics are missing, use placeholders like "[X%]", "[Y users]", or "(quantify impact)" instead of inventing fake numbers
5. Keep it concise (one line, ~15-25 words)
6. Focus on achievements and outcomes, not just responsibilities
7. Make it relevant to the role and company context

Return ONLY the improved bullet point text, nothing else. No explanations, no markdown, no quotes. Just the bullet text.`;
}
