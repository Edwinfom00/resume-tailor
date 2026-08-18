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
    pricing: "Preise",
    faq: "FAQ",
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
      fillTitle: "Mit KI ausfüllen",
      fillDescription:
        "Wählen Sie einen Abschnitt, beschreiben Sie die Fakten und erhalten Sie einen Entwurf zur Prüfung.",
      fillSectionLabel: "Abschnitt",
      fillDetailsLabel: "Was soll hinzugefügt werden?",
      fillDetailsPlaceholder:
        "Beschreiben Sie die Details für Ihren Lebenslauf, einschließlich Technologien, Ergebnissen und Links, falls vorhanden...",
      fillProjectHint:
        "Nennen Sie für ein persönliches Projekt den Namen, Zweck, Technologien, Ergebnisse und öffentliche Links.",
      fillConfirmationHint:
        "Der Copilot erstellt einen Vorschlag, den Sie vor einer Änderung Ihres Lebenslaufs prüfen und bestätigen.",
      fillSubmitLabel: "Entwurf erstellen",
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
    title: "Passen Sie Ihren Lebenslauf an.",
    titleAccent: "Nutzen Sie jede Chance.",
    description:
      "Resume Tailor vergleicht Ihren Lebenslauf mit jedem Stellenangebot und gibt Ihnen klare, abschnittsweise Empfehlungen, damit Sie herausstechen und mehr Einladungen erhalten.",
    primaryAction: "Lebenslauf hochladen & starten",
    secondaryAction: "So funktioniert es",
    trustLabel: "Für Ihre nächste Chance entwickelt",
    pillars: {
      matching: {
        title: "Intelligenter Abgleich",
        description: "Sehen Sie, wie gut Ihr Lebenslauf zu jeder Stelle passt.",
      },
      recommendations: {
        title: "Umsetzbare Empfehlungen",
        description: "Erhalten Sie konkrete Verbesserungen für jeden Abschnitt.",
      },
      ats: {
        title: "ATS-freundliche Optimierung",
        description: "Steigern Sie die Relevanz mit einem klaren, lesbaren Layout.",
      },
    },
    workflow: {
      eyebrow: "So funktioniert es",
      title: "So funktioniert es",
      showcaseTitle: "Ein besserer Lebenslauf beginnt mit dem richtigen Kontext.",
      description: "Drei einfache Schritte zu einem besser passenden Lebenslauf.",
      upload: {
        title: "Lebenslauf hochladen",
        description: "Starten Sie mit Ihrem aktuellen Lebenslauf als PDF oder DOCX.",
      },
      jobOffer: {
        title: "Stellenangebot hinzufügen",
        description: "Fügen Sie die Stellenbeschreibung oder den Link zur Anzeige ein.",
      },
      recommendations: {
        title: "Empfehlungen erhalten",
        description: "Prüfen Sie personalisierte Vorschläge, um Ihre Übereinstimmung zu verbessern.",
      },
    },
    features: {
      title: "Alles, was Sie für Ihren Lebenslauf brauchen",
      description: "Leistungsstarke, fokussierte Werkzeuge für eine überzeugendere Bewerbung.",
      profile: {
        title: "Profil optimieren",
        description: "Verbessern Sie Ihre Zusammenfassung und Stärken für Ihre Wunschrolle.",
      },
      skills: {
        title: "Kenntnisse intelligent abgleichen",
        description: "Erkennen Sie fehlende Kenntnisse und erhalten Sie passende Vorschläge.",
      },
      projects: {
        title: "Die richtigen Projekte priorisieren",
        description: "Platzieren Sie die relevanteste Arbeit dort, wo Recruiter sie sehen.",
      },
      export: {
        title: "Professionelles PDF exportieren",
        description: "Laden Sie einen klaren, ATS-freundlichen Lebenslauf herunter.",
      },
    },
    pricing: {
      eyebrow: "Preise",
      title: "Ein kostenloses Tool ohne Kompromisse.",
      description: "Resume Tailor bleibt kostenlos, Open Source und datenschutzfreundlich, damit Sie jede Bewerbung ohne Kosten und ohne Preisgabe Ihrer Daten anpassen können.",
      planName: "Resume Tailor",
      price: "0 XAF",
      cadence: "für immer",
      action: "Kostenlos starten",
      note: "Keine Kreditkarte. Keine zeitlich begrenzte Testphase.",
      privacy: {
        title: "Ihre Daten bleiben bei Ihnen",
        description: "Wir speichern weder Ihren Lebenslauf noch die Stellenanzeigen, die Sie analysieren.",
      },
      openSource: {
        title: "Open Source",
        description: "Der Code ist zugänglich, überprüfbar und wird von der Community weiterentwickelt.",
      },
      free: {
        title: "Wirklich kostenlos",
        description: "Alle wichtigen Funktionen bleiben ohne Abonnement verfügbar.",
      },
    },
    testimonials: {
      eyebrow: "Erfahrungen",
      title: "Mit mehr Selbstvertrauen vorankommen.",
      description: "Beispielhafte Rückmeldungen von Kandidatinnen und Kandidaten, die ihren Lebenslauf anpassen möchten, ohne ihre Stimme zu verlieren.",
      items: [
        {
          name: "Amélie R.",
          role: "Full-Stack-Entwicklerin",
          quote: "Ich konnte endlich sehen, welche Erfahrungen ich für die gewünschte Stelle wirklich hervorheben sollte.",
        },
        {
          name: "Koffi N.",
          role: "Projektmanager",
          quote: "Die Vorschläge für jeden Abschnitt geben mir eine klare Richtung, ohne meinen gesamten Werdegang neu zu schreiben.",
        },
        {
          name: "Lina B.",
          role: "Produktdesignerin",
          quote: "Meinen Lebenslauf in wenigen Augenblicken mit einer Stellenanzeige zu vergleichen, lässt mich deutlich sicherer bewerben.",
        },
        {
          name: "Thomas D.",
          role: "Softwareentwickler",
          quote: "Zu wissen, dass mein Lebenslauf nicht online gespeichert wird, macht das Tool auch für sensible Bewerbungen leicht nutzbar.",
        },
        {
          name: "Sarah M.",
          role: "Business-Analystin",
          quote: "Der Abgleich mit der Stellenanzeige hat mir geholfen, meine Stärken mit Begriffen zu beschreiben, die Recruiter bereits suchen.",
        },
        {
          name: "Malik E.",
          role: "Berater",
          quote: "Ich kann eine Lebenslaufbasis für mehrere Möglichkeiten anpassen, ohne erneut Zeit in die Formatierung zu investieren.",
        },
        {
          name: "Sophie L.",
          role: "Marketingmanagerin",
          quote: "Die Projektvorschläge haben mir geholfen, meine Wirkung viel konkreter zu beschreiben.",
        },
        {
          name: "Jordan P.",
          role: "Front-End-Entwickler",
          quote: "Es ist beruhigend, konkrete Hinweise zu erhalten und trotzdem jede Änderung an meinem Lebenslauf selbst zu kontrollieren.",
        },
        {
          name: "Claire V.",
          role: "HR-Beraterin",
          quote: "Ich sehe sofort, was für die Stelle angepasst werden sollte, ohne dass mein Lebenslauf überladen wirkt.",
        },
        {
          name: "Yann K.",
          role: "Data Engineer",
          quote: "Das Ergebnis bleibt meiner Erfahrung treu, aber jede Bewerbung wirkt deutlich fokussierter.",
        },
        {
          name: "Nora A.",
          role: "Produktmanagerin",
          quote: "Ich prüfe jeden Vorschlag gern, bevor ich ihn übernehme. Es bleibt mein Lebenslauf, nur mit einer klareren Richtung.",
        },
        {
          name: "Hugo S.",
          role: "Mobile-Entwickler",
          quote: "Der PDF-Export ist professionell und der gesamte Ablauf bleibt vom ersten Upload bis zur Bewerbung einfach.",
        },
      ],
    },
    finalCta: {
      title: "Lassen Sie sich die richtige Gelegenheit nicht entgehen.",
      description: "Passen Sie Ihren Lebenslauf an die Stelle an, die zählt, und bewerben Sie sich mit mehr Selbstvertrauen.",
      action: "Kostenlos starten",
    },
    faq: {
      title: "Häufig gestellte Fragen",
      description: "Alles, was Sie vor dem Anpassen Ihres Lebenslaufs wissen müssen. Sie behalten die Kontrolle über Ihre Daten und jede vorgeschlagene Änderung.",
      groups: [
        {
          title: "Erste Schritte",
          items: [
            {
              question: "Was ist Resume Tailor?",
              answer: "Resume Tailor hilft Ihnen, Ihren Lebenslauf mit einer Stellenanzeige zu vergleichen und die wichtigsten Verbesserungen für Ihre Bewerbung zu erkennen.",
            },
            {
              question: "Wie fange ich an?",
              answer: "Laden Sie Ihren Lebenslauf hoch, fügen Sie die interessante Stellenanzeige hinzu und prüfen Sie anschließend die Empfehlungen Abschnitt für Abschnitt.",
            },
          ],
        },
        {
          title: "Datenschutz",
          items: [
            {
              question: "Wird mein Lebenslauf gespeichert?",
              answer: "Nein. Resume Tailor speichert weder Ihren Lebenslauf noch die Stellenanzeige, die Sie analysieren.",
            },
            {
              question: "Behalte ich die Kontrolle über die Änderungen?",
              answer: "Ja. Empfehlungen dienen als Orientierung: Sie entscheiden, welche Änderungen Sie vor dem Export Ihres Lebenslaufs übernehmen.",
            },
          ],
        },
        {
          title: "Open Source",
          items: [
            {
              question: "Ist Resume Tailor wirklich kostenlos?",
              answer: "Ja. Die wichtigsten Funktionen sind ohne Abonnement und ohne zeitlich begrenzte Testphase kostenlos verfügbar.",
            },
            {
              question: "Kann ich zum Projekt beitragen?",
              answer: "Ja. Das Projekt ist Open Source, sodass sein Code von der Community eingesehen, geprüft und verbessert werden kann.",
            },
          ],
        },
      ],
    },
    footer: {
      description: "Ein kostenloser Arbeitsbereich, um Ihren Lebenslauf für jede Gelegenheit anzupassen, ohne Ihre Daten zu speichern.",
      productLabel: "Produkt",
      workflowLabel: "Ablauf",
      resourcesLabel: "Ressourcen",
      commitmentsLabel: "Unsere Versprechen",
      copyright: "© 2026 Resume Tailor. Alle Rechte vorbehalten.",
      badges: ["Kostenlos", "Open Source", "Keine Speicherung"],
    },
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
    inlineEdit: {
      doubleClickHint: "Doppelklicken zum Bearbeiten",
      editingSectionTitle: "Abschnitt bearbeiten",
      saveChanges: "Speichern",
      cancel: "Abbrechen",
      aiEnhance: "KI Optimierung",
      aiEnhancing: "Wird optimiert...",
      addItem: "Eintrag hinzufügen",
      removeItem: "Entfernen",
      nameLabel: "Vollständiger Name",
      headlineLabel: "Berufsbezeichnung",
      emailLabel: "E-Mail-Adresse",
      phoneLabel: "Telefonnummer",
      locationLabel: "Standort",
      summaryLabel: "Zusammenfassung",
      highlightsLabel: "Highlights (eins pro Zeile)",
      employerLabel: "Arbeitgeber",
      roleLabel: "Position / Rolle",
      datesLabel: "Zeitraum",
      achievementsLabel: "Erfolge (eins pro Zeile)",
      projectNameLabel: "Projektname",
      descriptionLabel: "Beschreibung",
      technologiesLabel: "Technologien (kommagetrennt)",
      groupNameLabel: "Kategorie / Gruppe",
      skillsLabel: "Kenntnisse (kommagetrennt)",
      institutionLabel: "Institution",
      credentialLabel: "Abschluss / Titel",
      fieldOfStudyLabel: "Fachrichtung",
      languageNameLabel: "Sprache",
      proficiencyLabel: "Niveau",
      interestNameLabel: "Interesse / Hobby",
      websiteLabel: "Webseite / Portfolio URL",
      aiAssistantTitle: "KI-Abschnittsoptimierung",
      aiPromptPlaceholder: "Beschreiben Sie Ihre Erfolge, Details oder Anweisungen zur Überarbeitung dieses Abschnitts...",
      aiGenerateBtn: "Mit KI optimieren",
      aiPresetsTitle: "Schnelle KI-Vorschläge",
      addBullet: "Stichpunkt hinzufügen •",
      bulletCountHint: "Zeilen / Stichpunkte",
    },
  },
} satisfies Messages;
