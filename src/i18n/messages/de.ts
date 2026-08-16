import type { Messages } from "@/i18n/messages/types";

export const messages = {
  metadata: {
    title: "Resume Tailor",
    description: "Erstellen Sie zielgerichtete Lebensläufe für die Chancen, die zählen.",
  },
  languageSwitcher: {
    label: "Sprache auswählen",
  },
  resumeExport: {
    downloadLabel: "PDF herunterladen",
    errorLabel: "Das PDF konnte nicht exportiert werden. Bitte erneut versuchen.",
    exportingLabel: "PDF wird erstellt…",
  },
  home: {
    eyebrow: "Resume Tailor",
    title: "Passen Sie jeden Lebenslauf an die Stelle an, die zählt.",
    description:
      "Erstellen Sie einen überzeugenden, stellenbezogenen Lebenslauf mit einer skalierbaren mehrsprachigen Grundlage.",
    primaryAction: "Jetzt starten",
    secondaryAction: "Dokumentation lesen",
  },
  resume: {
    profile: {
      title: "Berufliches Profil",
    },
    experience: {
      title: "Berufserfahrung",
      presentLabel: "heute",
    },
    projects: {
      title: "Eigenständige Projekte",
      roleLabel: "Rolle",
      technologiesLabel: "Technologien",
    },
    education: {
      title: "Ausbildung",
    },
    skills: {
      title: "Kenntnisse und Fähigkeiten",
    },
    languages: {
      title: "Sprachkenntnisse",
      nativeLabel: "Muttersprache",
    },
    interests: {
      title: "Interessen",
    },
  },
} satisfies Messages;
