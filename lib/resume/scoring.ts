import type { Resume } from "./schema";

export interface ResumeScore {
  overall: number;
  sections: { name: string; score: number; feedback: string }[];
}

export function scoreResume(_resume: Resume): ResumeScore {
  return {
    overall: 72,
    sections: [
      { name: "Summary", score: 80, feedback: "Clear and concise." },
      { name: "Experience", score: 70, feedback: "Consider adding metrics." },
      { name: "Education", score: 75, feedback: "Looks good." },
      { name: "Skills", score: 65, feedback: "Consider grouping by category." },
    ],
  };
}
