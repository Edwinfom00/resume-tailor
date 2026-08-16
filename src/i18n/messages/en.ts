import type { Messages } from "@/i18n/messages/types";

export const messages = {
  metadata: {
    title: "Resume Tailor",
    description: "Create targeted resumes for the opportunities that matter.",
  },
  languageSwitcher: {
    label: "Choose language",
  },
  home: {
    eyebrow: "Resume Tailor",
    title: "Tailor every resume to the role that matters.",
    description:
      "Build a compelling, role-specific resume with a multilingual foundation that is ready to grow.",
    primaryAction: "Start tailoring",
    secondaryAction: "Read the documentation",
  },
  resume: {
    profile: {
      title: "Professional Profile",
    },
    experience: {
      title: "Work Experience",
      presentLabel: "Present",
    },
    projects: {
      title: "Independent Projects",
      roleLabel: "Role",
      technologiesLabel: "Technologies",
    },
    education: {
      title: "Education",
    },
  },
} satisfies Messages;
