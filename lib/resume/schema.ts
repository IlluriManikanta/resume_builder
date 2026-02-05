import { z } from "zod";

export const experienceEntrySchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export const educationEntrySchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string().optional(),
  field: z.string().optional(),
  location: z.string().optional(),
  endDate: z.string().optional(),
});

export const resumeSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  summary: z.string().default(""),
  experience: z.array(experienceEntrySchema).default([]),
  education: z.array(educationEntrySchema).default([]),
  skills: z.array(z.string()).default([]),
});

export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type Resume = z.infer<typeof resumeSchema>;
