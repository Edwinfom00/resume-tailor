import type { Messages } from "@/i18n/messages/types";

export const messages = {
  metadata: {
    title: "Resume Tailor",
    description: "Erstellen Sie zielgerichtete Lebensläufe für die Chancen, die zählen.",
  },
  languageSwitcher: {
    label: "Sprache auswählen",
  },
  navigation: {
    homeLabel: "Startseite von Resume Tailor",
    primaryLabel: "Hauptnavigation",
    features: "Funktionen",
    howItWorks: "So funktioniert es",
    benefits: "Vorteile",
    pricing: "Preise",
    resources: "Ressourcen",
    getStarted: "Loslegen",
  },
  workspaceHeader: {
    homeLabel: "Startseite von Resume Tailor",
    searchLabel: "Jobs, Schlüsselwörter oder Vorschläge suchen",
    searchPlaceholder: "Jobs, Schlüsselwörter oder Vorschläge suchen...",
    searchShortcutLabel: "Befehl K",
    matchLabel: "Übereinstimmung",
    matchValue: "-- %",
    exportLabel: "PDF exportieren",
  },
  upload: {
    dashboardLabel: "Dashboard",
    title: "Analyse starten",
    description:
      "Laden Sie Ihren Lebenslauf und das Stellenangebot hoch, um personalisierte Empfehlungen zu erhalten.",
    stepLabel: "1",
    heading: "Lebenslauf hochladen",
    supportText:
      "Laden Sie die neueste Version Ihres Lebenslaufs hoch. PDF- und DOCX-Formate werden unterstützt.",
    dropzoneLabel: "Ziehen Sie Ihren Lebenslauf hierher",
    dropzoneSeparator: "oder",
    chooseFileLabel: "Datei auswählen",
    fileTypesLabel: "PDF oder DOCX bis zu 10 MB",
    uploadedFileLabel: "Hochgeladene Datei",
    mockFileName: "Edwin_Fom_Resume.pdf",
    mockFileMetadata: "245 KB · Gerade hochgeladen",
    uploadedJustNowLabel: "Gerade hochgeladen",
    fileTypeLabel: "PDF",
    changeFileLabel: "Ändern",
    removeFileLabel: "Entfernen",
    emptyFileLabel: "Keine Datei ausgewählt",
    privacyLabel: "Ihre Dateien sind sicher und privat. Wir geben Ihre Daten niemals weiter.",
    analyzeLabel: "Übereinstimmung analysieren",
    analyzingLabel: "Analyse läuft…",
    analyzeDescription: "Erhalten Sie personalisierte Empfehlungen",
    sampleLabel: "Beispieldaten ausprobieren",
    sampleDescription: "Sehen Sie anhand eines Beispiels, wie es funktioniert",
    clearLabel: "Alles löschen",
    clearDescription: "Alle Eingaben entfernen",
    workflow: {
      uploadTitle: "Lebenslauf hochladen",
      uploadDescription: "Fügen Sie Ihren Lebenslauf als PDF oder DOCX hinzu.",
      offerTitle: "Stellenangebot hinzufügen",
      offerDescription: "Fügen Sie die Job-URL oder Beschreibung ein.",
      recommendationsTitle: "Empfehlungen erhalten",
      recommendationsDescription:
        "Erhalten Sie KI-gestützte Hinweise zur Optimierung Ihres Lebenslaufs.",
    },
    invalidFileLabel: "Wählen Sie eine PDF- oder DOCX-Datei unter 10 MB.",
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
