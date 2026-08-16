import type { Messages } from "@/i18n/messages/types";

export const messages = {
  metadata: {
    title: "Resume Tailor",
    description: "Créez des CV ciblés pour les opportunités qui comptent.",
  },
  languageSwitcher: {
    label: "Choisir la langue",
  },
  home: {
    eyebrow: "Resume Tailor",
    title: "Adaptez chaque CV au poste qui compte.",
    description:
      "Créez un CV convaincant et adapté au poste grâce à une base multilingue prête à évoluer.",
    primaryAction: "Commencer",
    secondaryAction: "Lire la documentation",
  },
  resume: {
    profile: {
      title: "Profil professionnel",
    },
    experience: {
      title: "Expérience professionnelle",
      presentLabel: "Aujourd’hui",
    },
    projects: {
      title: "Projets indépendants",
      roleLabel: "Rôle",
      technologiesLabel: "Technologies",
    },
    education: {
      title: "Formation",
    },
    skills: {
      title: "Compétences",
    },
  },
} satisfies Messages;
