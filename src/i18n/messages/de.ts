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
    matchGainLabel: "+{value} %",
    matchLossLabel: "{value} %",
    recalculatingLabel: "Übereinstimmung wird neu berechnet",
    undoLabel: "Letzte Änderung rückgängig machen",
    redoLabel: "Letzte Änderung wiederherstellen",
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
    uploadedJustNowLabel: "Gerade hochgeladen",
    changeFileLabel: "Ändern",
    removeFileLabel: "Entfernen",
    emptyFileLabel: "Keine Datei ausgewählt",
    privacyLabel: "Ihre Dateien sind sicher und privat. Wir geben Ihre Daten niemals weiter.",
    validatingLabel: "Datei wird geprüft…",
    parsingLabel: "Ihr Lebenslauf wird gelesen…",
    parsingHint: "Profil, Erfahrung, Projekte und Kenntnisse werden extrahiert.",
    parsedLabel: "Ausgelesen",
    retryLabel: "Erneut versuchen",
    warningsLabel: "Mit Hinweisen importiert",
    warnings: {
      MISSING_EMAIL: "Es wurde keine E-Mail-Adresse gefunden.",
      MISSING_HEADLINE: "Es wurde keine berufliche Kurzbeschreibung gefunden.",
      MISSING_SUMMARY: "Die Profilzusammenfassung ist sehr kurz.",
      NO_EXPERIENCE: "Es wurde keine Berufserfahrung erkannt.",
      NO_SKILLS: "Es wurde kein Kenntnisse-Abschnitt erkannt.",
      NO_PROJECTS: "Es wurden keine Projekte erkannt.",
      NO_EDUCATION: "Es wurde keine Ausbildung erkannt.",
      SPARSE_ACHIEVEMENTS: "Bei einigen Positionen fehlen Erfolge.",
    },
    analyzeLabel: "Übereinstimmung analysieren",
    analyzingLabel: "Analyse läuft…",
    analyzeDescription: "Erhalten Sie personalisierte Empfehlungen",
    reanalyzeLabel: "Analyse erneut ausführen",
    openWorkspaceLabel: "Analyse-Arbeitsbereich öffnen",
    needsResumeLabel: "Laden Sie einen Lebenslauf hoch, um zu starten.",
    needsJobLabel: "Fügen Sie eine Job-URL oder die Stellenbeschreibung ein.",
    stageValidatingJob: "Stellen-Link wird geprüft",
    stageFetchingJob: "Stellenangebot wird abgerufen",
    stageStructuringJob: "Stellenanforderungen werden analysiert",
    stageReadingResume: "Ihr Lebenslauf wird gelesen",
    stageGeneratingRecommendations:
      "Erfahrung wird verglichen und Empfehlungen werden erstellt",
    analysisFailedLabel: "Die Analyse konnte nicht abgeschlossen werden.",
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
  },
  jobOffer: {
    stepLabel: "2",
    heading: "Stellenangebot hinzufügen",
    supportText:
      "Fügen Sie die Stellenanzeige per URL hinzu oder fügen Sie die vollständige Beschreibung ein.",
    urlLabel: "URL des Stellenangebots einfügen",
    urlPlaceholder: "https://unternehmen.de/karriere/12345",
    fetchLabel: "Abrufen",
    parseDescriptionLabel: "Text analysieren",
    validatingLabel: "Link wird geprüft…",
    fetchingLabel: "Stellenangebot wird abgerufen…",
    structuringLabel: "Anforderungen werden extrahiert…",
    readyLabel: "Stellenangebot bereit",
    retryLabel: "Erneut versuchen",
    urlHint: "Wir extrahieren die Stellendetails automatisch.",
    separatorLabel: "oder",
    descriptionLabel: "Stellenbeschreibung einfügen",
    descriptionPlaceholder: "Fügen Sie hier die vollständige Stellenbeschreibung ein...",
    previewLabel: "Analysierte Vorschau",
    autoExtractedLabel: "Automatisch extrahiert",
    roleLabel: "Position",
    companyLabel: "Unternehmen",
    requirementsLabel: "Wichtige Anforderungen",
    requirementsCountLabel: "{count} Anforderungen erkannt",
    notDetectedLabel: "Nicht erkannt",
    previewNote:
      "Aus dem Stellenangebot extrahiert. Prüfen Sie die Angaben und starten Sie dann die Analyse.",
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
    emptyTitle: "Noch keine Analyse",
    emptyDescription:
      "Fügen Sie einen Lebenslauf und ein Stellenangebot hinzu, um zu starten.",
    emptyActionLabel: "Analyse starten",
    jobOffer: {
      title: "Stellenangebot",
      optionsLabel: "Optionen zum Stellenangebot",
      detectedRequirementsLabel: "Erkannte Anforderungen",
      matchedSummarySuffix: "übereinstimmend",
      matchedLabel: "Erfüllt",
      missingLabel: "Fehlend",
      fullDescriptionLabel: "Vollständige Stellenbeschreibung anzeigen",
      priorityKeywordsLabel: "Prioritäts-Schlüsselwörter",
      priorityKeywordsHint: "Nach Wichtigkeit im Angebot sortiert",
      emptyLabel:
        "Fügen Sie ein Stellenangebot hinzu, um seine Anforderungen hier zu sehen.",
      noRequirementsLabel:
        "In diesem Angebot wurden keine konkreten Anforderungen erkannt.",
      noKeywordsLabel: "Es wurden keine Prioritäts-Schlüsselwörter erkannt.",
      notDetectedLabel: "Nicht erkannt",
      extractedOnLabel: "Extrahiert am {date}",
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
      emptyLabel: "Laden Sie einen Lebenslauf hoch, um ihn hier zu sehen.",
    },
    recommendations: {
      title: "KI-Empfehlungen",
      infoLabel: "Über die KI-Empfehlungen",
      openLabel: "Empfehlung öffnen",
      closeLabel: "Empfehlung schließen",
      currentLabel: "Aktuell",
      suggestedImprovementLabel: "Vorgeschlagene Verbesserung",
      relevanceLabel: "+{value} % Relevanz",
      acceptLabel: "Übernehmen",
      applyingLabel: "Wird angewendet…",
      applyingChangesTitle: "Ihre Änderungen werden angewendet",
      applyingChangesDescription:
        "Der ausgewählte Inhalt in Ihrem Lebenslauf wird aktualisiert.",
      evaluatingMatchTitle: "Ihre Übereinstimmung wird neu bewertet",
      evaluatingMatchDescription:
        "Ihr aktualisierter Lebenslauf wird mit dem aktuellen Stellenangebot verglichen.",
      applicationStepLabel: "Änderungen im Lebenslauf anwenden",
      evaluationStepLabel: "Übereinstimmung mit dem Stellenangebot bewerten",
      processingLabel: "Wird verarbeitet",
      editLabel: "Bearbeiten",
      ignoreLabel: "Ignorieren",
      acceptedLabel: "Übernommen",
      ignoredLabel: "Ignoriert",
      restoreLabel: "Wiederherstellen",
      undoLabel: "Rückgängig",
      sectionUpdatedLabel: "{section} aktualisiert",
      scoreChangeLabel: "Übereinstimmung {previous} % → {next} %",
      sectionScoreLabel: "Abschnittswert",
      issuesLabel: "Zu verbessern",
      strengthsLabel: "Bereits stark",
      proposedChangeLabel: "Vorgeschlagene Änderung",
      impactLabel: "+{value} % Wirkung",
      priorityHighLabel: "Hohe Priorität",
      priorityMediumLabel: "Mittlere Priorität",
      priorityLowLabel: "Niedrige Priorität",
      alignedLabel:
        "Ihr Lebenslauf passt in diesem Abschnitt bereits sehr gut zur Stelle.",
      emptyLabel:
        "Fügen Sie einen Lebenslauf und ein Stellenangebot hinzu, um zu starten.",
      highImpactTitle: "Verbesserungen mit hoher Wirkung",
      highImpactDescription:
        "Konzentrieren Sie sich auf diese Änderungen, um Ihre Übereinstimmung zu steigern",
      highImpactBadge: "Hohe Wirkung",
      noHighImpactLabel: "Es stehen keine Änderungen mit hoher Wirkung aus.",
      confirmTitle: "Vor dem Anwenden bestätigen",
      confirmDescription:
        "Ihr Lebenslauf belegt diese Angabe noch nicht. Bestätigen Sie ihre Richtigkeit, bevor Sie sie hinzufügen.",
      confirmAcknowledgeLabel: "Ich bestätige, dass dies zutrifft",
      editTitle: "Vorschlag bearbeiten",
      originalLabel: "Original",
      proposedLabel: "Vorschlag",
      editHint: "Eine Zeile pro Aufzählungspunkt.",
      saveChangesLabel: "Änderungen speichern",
      cancelLabel: "Abbrechen",
      noProposedContentLabel:
        "Für diesen Vorschlag liegt noch kein neu formulierter Text vor.",
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
          description: "Ergänzen Sie fehlende oder verwandte Kenntnisse",
        },
      },
      suggestionTypes: {
        "rewrite-profile": "Profil neu formulieren",
        "rewrite-experience": "Erfahrungspunkte neu formulieren",
        "reorder-experiences": "Erfahrungen neu ordnen",
        "rewrite-project": "Projektbeschreibung neu formulieren",
        "reorder-projects": "Projekte neu ordnen",
        "add-skill": "Kenntnis hinzufügen",
        "remove-skill": "Kenntnis entfernen",
        "highlight-skill": "Kenntnis hervorheben",
        "shorten-content": "Inhalt kürzen",
        "keyword-improvement": "Prioritäts-Schlüsselwörter ergänzen",
        "missing-skill": "Fehlende Kenntnis ergänzen",
      },
    },
    copilot: {
      title: "KI-Copilot",
      openLabel: "Lebenslauf-Copilot öffnen",
      closeLabel: "KI-Copilot schließen",
      workingWithLabel: "Sie arbeiten an",
      noJobContextLabel: "Noch kein Stellenangebot hinzugefügt",
      focusedOnLabel: "Fokus auf",
      clearFocusLabel: "Fokus aufheben",
      chatLabel: "Chat",
      actionsLabel: "Aktionen",
      assistantLabel: "Copilot",
      userLabel: "Sie",
      greeting: "Hallo! 👋",
      greetingPrompt:
        "Ich helfe Ihnen, Ihren Lebenslauf auf diese Stelle abzustimmen. Was möchten Sie verbessern?",
      thinkingLabel: "Der Lebenslauf-Copilot denkt nach",
      errorTitle: "Der Lebenslauf-Copilot konnte diese Anfrage nicht abschließen.",
      retryLabel: "Erneut versuchen",
      dismissLabel: "Schließen",
      needsResumeLabel:
        "Laden Sie einen Lebenslauf hoch, um den Lebenslauf-Copilot zu nutzen.",
      proposalTitle: "Vorgeschlagene Änderung",
      changedBulletsLabel: "{count} Aufzählungspunkte werden aktualisiert",
      impactEstimateLabel: "+{value} % geschätzte Relevanz",
      detailedChangesLabel: "Detaillierte Änderungen anzeigen",
      applyChangesLabel: "Änderungen anwenden",
      applyingLabel: "Wird angewendet…",
      applyingChangesTitle: "Ihre Änderungen werden angewendet",
      applyingChangesDescription:
        "Der ausgewählte Inhalt in Ihrem Lebenslauf wird aktualisiert.",
      evaluatingMatchTitle: "Ihre Übereinstimmung wird neu bewertet",
      evaluatingMatchDescription:
        "Ihr aktualisierter Lebenslauf wird mit dem aktuellen Stellenangebot verglichen.",
      applicationStepLabel: "Änderungen im Lebenslauf anwenden",
      evaluationStepLabel: "Übereinstimmung mit dem Stellenangebot bewerten",
      processingLabel: "Wird verarbeitet",
      appliedLabel: "Änderungen angewendet",
      undoLabel: "Rückgängig",
      editLabel: "Bearbeiten",
      ignoreLabel: "Ignorieren",
      ignoredLabel: "Ignoriert",
      restoreLabel: "Wiederherstellen",
      confirmFactsTitle: "Vor dem Hinzufügen bestätigen",
      confirmFactsDescription:
        "Diese Änderung führt Angaben ein, die Ihr Lebenslauf nicht belegt. Bestätigen Sie deren Richtigkeit, bevor Sie sie anwenden.",
      confirmFactsAcknowledgeLabel: "Ich bestätige, dass dies zutrifft",
      newExperienceLabel: "Neue Erfahrung",
      newProjectLabel: "Neues Projekt",
      companyLabel: "Unternehmen",
      roleLabel: "Position",
      datesLabel: "Zeitraum",
      locationLabel: "Ort",
      bulletsLabel: "Aufzählungspunkte",
      quickActionsLabel: "Weitere Schnellaktionen",
      moreActionsLabel: "Weitere Aktionen",
      noActionsLabel: "Keine Aktionen verfügbar.",
      quickActions: {
        improveProfile: {
          label: "Profil verbessern",
          prompt:
            "Verbessern Sie meine Profilzusammenfassung für dieses Stellenangebot.",
        },
        reorderProjects: {
          label: "Projekte neu ordnen",
          prompt:
            "Ordnen Sie meine Projekte neu, sodass die relevantesten zuerst stehen.",
        },
        addExperience: {
          label: "Erfahrung hinzufügen",
          prompt:
            "Helfen Sie mir, eine neue Berufserfahrung zu meinem Lebenslauf hinzuzufügen.",
        },
        addProject: {
          label: "Projekt hinzufügen",
          prompt: "Helfen Sie mir, ein neues Projekt zu meinem Lebenslauf hinzuzufügen.",
        },
        addSkills: {
          label: "Kenntnisse hinzufügen",
          prompt:
            "Welche Kenntnisse sollte ich für diese Stelle in meinem Kenntnisse-Abschnitt ergänzen?",
        },
        optimizeForJob: {
          label: "Für diese Stelle optimieren",
          prompt: "Optimieren Sie meinen Lebenslauf für dieses Stellenangebot.",
        },
        rewriteBullets: {
          label: "Punkte neu formulieren",
          prompt:
            "Formulieren Sie die Aufzählungspunkte meiner Erfahrung {target} neu.",
        },
        makeMoreRelevant: {
          label: "Relevanter machen",
          prompt: "Machen Sie {target} für dieses Stellenangebot relevanter.",
        },
        makeShorter: {
          label: "Kürzen",
          prompt: "Kürzen Sie {target}, ohne Fakten zu verlieren.",
        },
      },
      composerPlaceholder: "Lebenslauf-Copilot fragen...",
      attachLabel: "Datei anhängen",
      sendLabel: "Nachricht senden",
      reviewNotice:
        "Der Copilot kann Fehler machen. Prüfen Sie die Vorschläge vor dem Anwenden.",
    },
  },
  resumeExport: {
    downloadLabel: "PDF herunterladen",
    errorLabel: "Das PDF konnte nicht exportiert werden. Bitte erneut versuchen.",
    exportingLabel: "PDF wird vorbereitet…",
  },
  domainErrors: {
    UNSUPPORTED_FILE:
      "Dieser Dateityp wird nicht unterstützt. Laden Sie einen Lebenslauf als PDF oder DOCX hoch.",
    FILE_TOO_LARGE: "Diese Datei überschreitet das Limit von 10 MB.",
    EMPTY_DOCUMENT: "In diesem Dokument wurde kein lesbarer Text gefunden.",
    TEXT_EXTRACTION_FAILED:
      "Das Dokument konnte nicht gelesen werden. Exportieren Sie es erneut als PDF oder DOCX.",
    INVALID_RESUME:
      "Dieses Dokument sieht nicht wie ein Lebenslauf aus. Laden Sie stattdessen Ihren Lebenslauf hoch.",
    PARTIAL_EXTRACTION:
      "Nur ein Teil des Lebenslaufs konnte strukturiert werden. Prüfen Sie den importierten Inhalt.",
    INVALID_URL: "Dieser Stellen-Link ist keine gültige URL.",
    UNREACHABLE_URL:
      "Diese Stellenseite konnte nicht geöffnet werden. Fügen Sie stattdessen die Stellenbeschreibung ein.",
    REQUEST_TIMEOUT:
      "Die Stellenseite hat zu lange gebraucht. Fügen Sie stattdessen die Stellenbeschreibung ein.",
    NON_HTML_RESPONSE:
      "Dieser Link führt nicht zu einer Stellenseite. Fügen Sie stattdessen die Stellenbeschreibung ein.",
    EMPTY_PAGE:
      "Diese Stellenseite lieferte keinen lesbaren Inhalt. Fügen Sie stattdessen die Stellenbeschreibung ein.",
    BLOCKED_PAGE:
      "Diese Website hat die Anfrage blockiert. Fügen Sie stattdessen die Stellenbeschreibung ein.",
    NO_JOB_CONTENT:
      "Diese Stellenseite konnte nicht ausgelesen werden. Fügen Sie die Beschreibung manuell ein.",
    EMPTY_DESCRIPTION:
      "Fügen Sie zuerst eine Stellen-URL oder die Stellenbeschreibung ein.",
    INVALID_JOB_OFFER:
      "Aus diesem Inhalt konnte kein Stellenangebot strukturiert werden.",
    INVALID_ANALYSIS_INPUT:
      "Die Analyse konnte nicht starten, weil der Lebenslauf oder das Stellenangebot unvollständig ist.",
    INVALID_COPILOT_REQUEST:
      "Der Lebenslauf-Copilot konnte den aktuellen Kontext nicht lesen.",
    NETWORK_ERROR:
      "Die Anfrage konnte nicht gesendet werden. Prüfen Sie Ihre Verbindung.",
    REQUEST_FAILED: "Die Anfrage konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
    UNKNOWN: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
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
