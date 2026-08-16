export type Messages = {
  metadata: {
    title: string;
    description: string;
  };
  languageSwitcher: {
    label: string;
  };
  navigation: {
    homeLabel: string;
    primaryLabel: string;
    features: string;
    howItWorks: string;
    benefits: string;
    pricing: string;
    resources: string;
    getStarted: string;
  };
  workspaceHeader: {
    homeLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchShortcutLabel: string;
    matchLabel: string;
    matchValue: string;
    exportLabel: string;
  };
  upload: {
    dashboardLabel: string;
    title: string;
    description: string;
    stepLabel: string;
    heading: string;
    supportText: string;
    dropzoneLabel: string;
    dropzoneSeparator: string;
    chooseFileLabel: string;
    fileTypesLabel: string;
    uploadedFileLabel: string;
    mockFileName: string;
    mockFileMetadata: string;
    uploadedJustNowLabel: string;
    fileTypeLabel: string;
    changeFileLabel: string;
    removeFileLabel: string;
    emptyFileLabel: string;
    privacyLabel: string;
    analyzeLabel: string;
    analyzingLabel: string;
    analyzeDescription: string;
    sampleLabel: string;
    sampleDescription: string;
    clearLabel: string;
    clearDescription: string;
    workflow: {
      uploadTitle: string;
      uploadDescription: string;
      offerTitle: string;
      offerDescription: string;
      recommendationsTitle: string;
      recommendationsDescription: string;
    };
    invalidFileLabel: string;
  };
  jobOffer: {
    stepLabel: string;
    heading: string;
    supportText: string;
    urlLabel: string;
    urlPlaceholder: string;
    fetchLabel: string;
    urlHint: string;
    separatorLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    previewLabel: string;
    autoExtractedLabel: string;
    roleLabel: string;
    roleValue: string;
    companyLabel: string;
    companyValue: string;
    requirementsLabel: string;
    requirementsValue: string;
    previewNote: string;
  };
  analysisBenefits: {
    heading: string;
    description: string;
    sectionRecommendationsTitle: string;
    sectionRecommendationsDescription: string;
    skillsGapTitle: string;
    skillsGapDescription: string;
    projectPrioritizationTitle: string;
    projectPrioritizationDescription: string;
    atsOptimizationTitle: string;
    atsOptimizationDescription: string;
    privacyTitle: string;
    privacyDescription: string;
  };
  studio: {
    jobOffer: {
      title: string;
      optionsLabel: string;
      detectedRequirementsLabel: string;
      matchedSummarySuffix: string;
      matchedLabel: string;
      missingLabel: string;
      fullDescriptionLabel: string;
      priorityKeywordsLabel: string;
      priorityKeywordsHint: string;
    };
    cv: {
      title: string;
      overviewLabel: string;
      profileLabel: string;
      experienceLabel: string;
      projectsLabel: string;
      skillsLabel: string;
      displayOptionsLabel: string;
      toggleGuidesLabel: string;
      zoomOutLabel: string;
      zoomInLabel: string;
      zoomLevelLabel: string;
      fitPreviewLabel: string;
      toggleCanvasThemeLabel: string;
      previousPageLabel: string;
      nextPageLabel: string;
      pageIndicatorLabel: string;
    };
    recommendations: {
      title: string;
      infoLabel: string;
      openLabel: string;
      closeLabel: string;
      currentLabel: string;
      suggestedImprovementLabel: string;
      relevanceLabel: string;
      acceptLabel: string;
      editLabel: string;
      ignoreLabel: string;
      acceptedLabel: string;
      highImpactTitle: string;
      highImpactDescription: string;
      highImpactBadge: string;
      items: {
        profile: {
          title: string;
          description: string;
        };
        experience: {
          title: string;
          description: string;
        };
        projects: {
          title: string;
          description: string;
        };
        skills: {
          title: string;
          description: string;
        };
      };
      improvements: {
        rewriteProfile: {
          title: string;
          description: string;
        };
        reorderProjects: {
          title: string;
          description: string;
        };
        highlightPostgres: {
          title: string;
          description: string;
        };
      };
    };
    copilot: {
      title: string;
      closeLabel: string;
      workingWithLabel: string;
      chatLabel: string;
      actionsLabel: string;
      assistantLabel: string;
      userLabel: string;
      greeting: string;
      greetingPrompt: string;
      sampleUserMessage: string;
      improvementsFoundLabel: string;
      suggestedChangeTitle: string;
      changedBulletsLabel: string;
      impactLabel: string;
      changeBullets: readonly string[];
      detailedChangesLabel: string;
      applyChangesLabel: string;
      appliedLabel: string;
      editLabel: string;
      ignoreLabel: string;
      quickActionsLabel: string;
      improveProfileLabel: string;
      reorderProjectsLabel: string;
      addExperienceLabel: string;
      addSkillsLabel: string;
      optimizeForJobLabel: string;
      moreActionsLabel: string;
      composerPlaceholder: string;
      attachLabel: string;
      sendLabel: string;
      reviewNotice: string;
      responseMessage: string;
      noActionsLabel: string;
    };
  };
  resumeExport: {
    downloadLabel: string;
    errorLabel: string;
    exportingLabel: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  resume: {
    profile: {
      title: string;
    };
    experience: {
      title: string;
      presentLabel: string;
    };
    projects: {
      title: string;
      roleLabel: string;
      technologiesLabel: string;
    };
    education: {
      title: string;
    };
    skills: {
      title: string;
    };
    languages: {
      title: string;
      nativeLabel: string;
    };
    interests: {
      title: string;
    };
  };
};
