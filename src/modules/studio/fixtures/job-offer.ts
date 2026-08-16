export type JobRequirementStatus = "matched" | "missing";

export type JobRequirement = Readonly<{
  name: string;
  status: JobRequirementStatus;
}>;

export const studioJobOffer = {
  company: "Acme Inc.",
  location: "San Francisco, CA",
  matchedRequirements: 7,
  postedDate: "Posted May 7, 2024",
  requirements: [
    { name: "TypeScript", status: "matched" },
    { name: "React", status: "matched" },
    { name: "PostgreSQL", status: "matched" },
    { name: "Node.js", status: "matched" },
    { name: "Docker", status: "missing" },
    { name: "AWS", status: "missing" },
    { name: "CI/CD", status: "missing" },
  ] satisfies readonly JobRequirement[],
  title: "Senior Full-Stack Engineer",
  totalRequirements: 10,
  type: "Full-time",
  keywords: [
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "AWS",
    "Docker",
    "CI/CD",
    "REST APIs",
    "JavaScript",
    "Git",
    "Agile",
    "Microservices",
  ],
} as const;
