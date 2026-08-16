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
  jobOffer: {
    stepLabel: "2",
    heading: "Stellenangebot hinzufügen",
    supportText:
      "Fügen Sie die Stellenanzeige per URL hinzu oder fügen Sie die vollständige Beschreibung ein.",
    urlLabel: "URL des Stellenangebots einfügen",
    urlPlaceholder: "https://unternehmen.de/karriere/12345",
    fetchLabel: "Abrufen",
    urlHint: "Wir extrahieren die Stellendetails automatisch.",
    separatorLabel: "oder",
    descriptionLabel: "Stellenbeschreibung einfügen",
    descriptionPlaceholder: "Fügen Sie hier die vollständige Stellenbeschreibung ein...",
    previewLabel: "Analysierte Vorschau (Beispiel)",
    autoExtractedLabel: "Automatisch extrahiert",
    roleLabel: "Position",
    roleValue: "Senior Full-Stack Engineer",
    companyLabel: "Unternehmen",
    companyValue: "Acme Inc.",
    requirementsLabel: "Wichtige Anforderungen",
    requirementsValue:
      "TypeScript, React, Node.js, PostgreSQL, AWS, Docker, CI/CD, REST-APIs, Kommunikation.",
    previewNote:
      "Die Vorschau ist ein Beispiel. Klicken Sie auf „Übereinstimmung analysieren“, um alle extrahierten Details zu sehen.",
  },
  analysisBenefits: {
    heading: "Das erhalten Sie",
    description:
      "Unsere KI analysiert Ihren Lebenslauf und das Stellenangebot für konkrete Erkenntnisse.",
    sectionRecommendationsTitle: "Empfehlungen für jeden Abschnitt",
    sectionRecommendationsDescription:
      "Verbessern Sie jeden Teil Ihres Lebenslaufs anhand der Stellenanforderungen.",
    skillsGapTitle: "Erkennung von Kompetenzlücken",
    skillsGapDescription:
      "Erkennen Sie fehlende Fähigkeiten und erhalten Sie passende Vorschläge.",
    projectPrioritizationTitle: "Projektpriorisierung",
    projectPrioritizationDescription:
      "Heben Sie die relevantesten Projekte für diese Position hervor.",
    atsOptimizationTitle: "ATS-freundliche Optimierung",
    atsOptimizationDescription:
      "Strukturieren Sie Ihren Lebenslauf so, dass ATS-Scans ihn problemlos lesen können.",
    privacyTitle: "Von Fachleuten geschätzt",
    privacyDescription:
      "Ihre Daten bleiben vertraulich und werden nur zur Verbesserung Ihres Lebenslaufs verwendet.",
  },
  studio: {
    jobOffer: {
      title: "Stellenangebot",
      optionsLabel: "Optionen zum Stellenangebot",
      detectedRequirementsLabel: "Erkannte Anforderungen",
      matchedSummarySuffix: "übereinstimmend",
      matchedLabel: "Erfüllt",
      missingLabel: "Fehlend",
      fullDescriptionLabel: "Vollständige Stellenbeschreibung anzeigen",
      priorityKeywordsLabel: "Prioritäts-Schlüsselwörter",
      priorityKeywordsHint: "Zum Ändern der Priorität ziehen",
    },
    cv: {
      title: "Ihr Lebenslauf",
      overviewLabel: "Übersicht",
      profileLabel: "Profil",
      experienceLabel: "Erfahrung",
      projectsLabel: "Projekte",
      skillsLabel: "Kenntnisse",
      displayOptionsLabel: "Anzeigeoptionen",
      toggleGuidesLabel: "Seitenhilfen umschalten",
      zoomOutLabel: "Verkleinern",
      zoomInLabel: "Vergrößern",
      zoomLevelLabel: "Vorschau-Zoom: {zoom} %",
      fitPreviewLabel: "Vorschau an Bildschirm anpassen",
      toggleCanvasThemeLabel: "Vorschau-Hintergrund umschalten",
      previousPageLabel: "Vorherige Seite",
      nextPageLabel: "Nächste Seite",
      pageIndicatorLabel: "Seite {current} von {total}",
    },
    recommendations: {
      title: "KI-Empfehlungen",
      infoLabel: "Über KI-Empfehlungen",
      openLabel: "Empfehlung öffnen",
      closeLabel: "Empfehlung schließen",
      currentLabel: "Aktuell",
      suggestedImprovementLabel: "Vorgeschlagene Verbesserung",
      relevanceLabel: "+{value} % Relevanz",
      acceptLabel: "Übernehmen",
      editLabel: "Bearbeiten",
      ignoreLabel: "Ignorieren",
      acceptedLabel: "Übernommen",
      highImpactTitle: "Verbesserungen mit hoher Wirkung",
      highImpactDescription: "Konzentrieren Sie sich auf diese Änderungen, um Ihre Übereinstimmung zu verbessern",
      highImpactBadge: "Hohe Wirkung",
      items: {
        profile: {
          title: "Profil",
          description: "Stärken Sie Ihre Zusammenfassung",
        },
        experience: {
          title: "Erfahrung",
          description: "Heben Sie relevante Erfolge hervor",
        },
        projects: {
          title: "Projekte",
          description: "Präsentieren Sie Ihre Arbeit besser",
        },
        skills: {
          title: "Kenntnisse",
          description: "Fügen Sie fehlende oder verwandte Kenntnisse hinzu",
        },
      },
      improvements: {
        rewriteProfile: {
          title: "Profil überarbeiten",
          description: "Machen Sie Ihre Zusammenfassung für diese Stelle besonders relevant",
        },
        reorderProjects: {
          title: "Projekte neu anordnen",
          description: "Führen Sie mit Projekten, die zur Stelle passen",
        },
        highlightPostgres: {
          title: "PostgreSQL hervorheben",
          description: "Betonen Sie Ihre PostgreSQL-Erfahrung",
        },
      },
    },
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
