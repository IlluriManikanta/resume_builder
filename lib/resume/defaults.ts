import type { Resume } from "./schema";

export const defaultResume: Resume = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 (555) 123-4567",
  summary:
    "Experienced software engineer with 5+ years building web applications. Passionate about clean code and user experience.",
  experience: [
    {
      id: "exp-1",
      company: "Acme Corp",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2020",
      endDate: "Present",
      bullets: [
        "Led migration of legacy monolith to microservices.",
        "Mentored 3 junior engineers.",
        "Reduced deployment time by 40%.",
      ],
    },
    {
      id: "exp-2",
      company: "Startup Inc",
      role: "Software Engineer",
      location: "Remote",
      startDate: "2018",
      endDate: "2020",
      bullets: [
        "Built customer-facing dashboard with React.",
        "Implemented CI/CD pipeline.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "State University",
      degree: "B.S.",
      field: "Computer Science",
      location: "Boston, MA",
      endDate: "2018",
    },
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL"],
};
