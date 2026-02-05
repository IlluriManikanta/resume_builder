import type { Resume } from "./schema";

export interface Recommendation {
  priority: number;
  message: string;
  area: string;
}

export interface ResumeScore {
  overall: number;
  recommendations: Recommendation[];
}

const ACTION_VERBS = new Set(
  [
    "achieved", "built", "created", "delivered", "designed", "developed",
    "drove", "established", "improved", "increased", "implemented",
    "launched", "led", "managed", "reduced", "scaled", "spearheaded",
    "streamlined", "transformed", "optimized", "coordinated", "executed",
    "initiated", "mentored", "negotiated", "resolved", "revitalized",
    "automated", "collaborated", "deployed", "expanded", "generated",
    "headed", "introduced", "maintained", "oversaw", "produced",
  ].map((v) => v.toLowerCase())
);

function hasActionVerb(text: string): boolean {
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/, "");
  return firstWord ? ACTION_VERBS.has(firstWord) : false;
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function hasNumber(s: string): boolean {
  return /\d|%|\$|\[X%\]|\[Y\]|\(quantify\)/i.test(s);
}

function collectRecommendations(resume: Resume): Recommendation[] {
  const recs: Recommendation[] = [];
  let priority = 0;

  // --- Missing sections ---
  if (!resume.summary?.trim()) {
    recs.push({
      priority: priority++,
      message: "Add a professional summary to give recruiters a quick overview.",
      area: "Summary",
    });
  }
  if (resume.experience.length === 0) {
    recs.push({
      priority: priority++,
      message: "Add at least one experience entry.",
      area: "Experience",
    });
  }
  if (resume.education.length === 0) {
    recs.push({
      priority: priority++,
      message: "Add your education section.",
      area: "Education",
    });
  }
  if (resume.skills.length === 0) {
    recs.push({
      priority: priority++,
      message: "List relevant skills to improve ATS match.",
      area: "Skills",
    });
  }

  // --- Contact ---
  if (!resume.name?.trim()) {
    recs.push({
      priority: priority++,
      message: "Add your name.",
      area: "Contact",
    });
  }
  if (!resume.email?.trim()) {
    recs.push({
      priority: priority++,
      message: "Add your email address.",
      area: "Contact",
    });
  }

  // --- Bullet length (all bullets from experience + projects) ---
  const allBullets = [
    ...resume.experience.flatMap((e) => e.bullets),
    ...resume.projects.flatMap((p) => p.bullets),
  ].filter(Boolean);

  const shortBullets = allBullets.filter((b) => wordCount(b) < 8);
  const longBullets = allBullets.filter((b) => wordCount(b) > 35);
  if (shortBullets.length > 0) {
    recs.push({
      priority: priority++,
      message: `${shortBullets.length} bullet(s) are very short. Aim for 10–25 words with impact.`,
      area: "Bullets",
    });
  }
  if (longBullets.length > 0) {
    recs.push({
      priority: priority++,
      message: `${longBullets.length} bullet(s) are long. Keep bullets to 1–2 lines (under ~25 words).`,
      area: "Bullets",
    });
  }

  // --- Action verbs ---
  const bulletsWithoutActionVerb = allBullets.filter((b) => !hasActionVerb(b));
  if (bulletsWithoutActionVerb.length > 0 && allBullets.length > 0) {
    recs.push({
      priority: priority++,
      message: `${bulletsWithoutActionVerb.length} of ${allBullets.length} bullets don’t start with a strong action verb (e.g. Led, Built, Improved).`,
      area: "Bullets",
    });
  }

  // --- Numbers / metrics ---
  const bulletsWithoutNumber = allBullets.filter((b) => !hasNumber(b));
  if (bulletsWithoutNumber.length > 0 && allBullets.length > 0) {
    recs.push({
      priority: priority++,
      message: "Add numbers or impact where possible (e.g. “Reduced load time by 40%”, “Managed 5 engineers”).",
      area: "Bullets",
    });
  }

  // --- Skills count ---
  if (resume.skills.length > 0 && resume.skills.length < 4) {
    recs.push({
      priority: priority++,
      message: "Consider listing more relevant skills (often 5–15) for better ATS coverage.",
      area: "Skills",
    });
  }
  if (resume.skills.length > 20) {
    recs.push({
      priority: priority++,
      message: "Consider trimming to the most relevant 10–15 skills to keep the resume focused.",
      area: "Skills",
    });
  }

  return recs;
}

function computeOverallScore(resume: Resume, recommendations: Recommendation[]): number {
  const maxDeductions = 100;
  let deduction = 0;

  // Missing critical sections (heavy weight)
  if (!resume.summary?.trim()) deduction += 12;
  if (resume.experience.length === 0) deduction += 20;
  if (resume.education.length === 0) deduction += 12;
  if (resume.skills.length === 0) deduction += 10;
  if (!resume.name?.trim() || !resume.email?.trim()) deduction += 10;

  // Bullets quality
  const allBullets = [
    ...resume.experience.flatMap((e) => e.bullets),
    ...resume.projects.flatMap((p) => p.bullets),
  ].filter(Boolean);

  if (allBullets.length > 0) {
    const withActionVerb = allBullets.filter((b) => hasActionVerb(b)).length;
    const withNumber = allBullets.filter((b) => hasNumber(b)).length;
    const actionVerbRatio = withActionVerb / allBullets.length;
    const numberRatio = withNumber / allBullets.length;
    if (actionVerbRatio < 0.7) deduction += 10;
    if (numberRatio < 0.5) deduction += 8;
    const badLength = allBullets.filter(
      (b) => wordCount(b) < 8 || wordCount(b) > 35
    ).length;
    if (badLength > 0) deduction += Math.min(8, badLength * 2);
  }

  // Skills count
  if (resume.skills.length > 0 && resume.skills.length < 4) deduction += 5;
  if (resume.skills.length > 20) deduction += 3;

  return Math.max(0, Math.min(100, 100 - deduction));
}

/**
 * Rules-based resume scoring (no AI). Returns 0–100 score and all recommendations;
 * caller can take top 3 for display.
 */
export function scoreResume(resume: Resume): ResumeScore {
  const recommendations = collectRecommendations(resume);
  const overall = computeOverallScore(resume, recommendations);

  return {
    overall,
    recommendations,
  };
}

/**
 * Returns the top N recommendations by priority (order they were added).
 */
export function topRecommendations(
  score: ResumeScore,
  n: number = 3
): Recommendation[] {
  return score.recommendations.slice(0, n);
}
