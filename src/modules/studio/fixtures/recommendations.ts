export type StudioRecommendationId =
  | "profile"
  | "experience"
  | "projects"
  | "skills";

export type StudioRecommendationTone = "positive" | "caution";

export type StudioRecommendation = Readonly<{
  id: StudioRecommendationId;
  score: number;
  tone: StudioRecommendationTone;
  currentKeywords?: readonly string[];
  suggestedKeywords?: readonly string[];
  relevanceGain?: number;
}>;

export type StudioHighImpactImprovementId =
  | "rewriteProfile"
  | "reorderProjects"
  | "highlightPostgres";

export type StudioHighImpactImprovement = Readonly<{
  id: StudioHighImpactImprovementId;
}>;

export const studioRecommendations = [
  { id: "profile", score: 74, tone: "caution" },
  { id: "experience", score: 81, tone: "positive" },
  { id: "projects", score: 76, tone: "caution" },
  {
    id: "skills",
    score: 68,
    tone: "caution",
    currentKeywords: [
      "TypeScript",
      "JavaScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Git",
      "Jest",
      "ESLint",
    ],
    suggestedKeywords: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "AWS",
      "CI/CD",
      "Git",
      "Jest",
      "ESLint",
    ],
    relevanceGain: 12,
  },
] as const satisfies readonly StudioRecommendation[];

export const studioHighImpactImprovements = [
  { id: "rewriteProfile" },
  { id: "reorderProjects" },
  { id: "highlightPostgres" },
] as const satisfies readonly StudioHighImpactImprovement[];
