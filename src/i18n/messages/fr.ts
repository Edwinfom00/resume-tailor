import type { Messages } from "@/i18n/messages/types";

export const messages = {
  metadata: {
    title: "Resume Tailor",
    description: "Créez des CV ciblés pour les opportunités qui comptent.",
  },
  languageSwitcher: {
    label: "Choisir la langue",
  },
  navigation: {
    homeLabel: "Accueil de Resume Tailor",
    primaryLabel: "Navigation principale",
    features: "Fonctionnalités",
    howItWorks: "Fonctionnement",
    benefits: "Avantages",
    pricing: "Tarifs",
    resources: "Ressources",
    getStarted: "Commencer",
  },
  workspaceHeader: {
    homeLabel: "Accueil de Resume Tailor",
    searchLabel: "Rechercher des offres, mots-clés ou suggestions",
    searchPlaceholder: "Rechercher des offres, mots-clés ou suggestions...",
    searchShortcutLabel: "Commande K",
    matchLabel: "Correspondance",
    matchValue: "-- %",
    exportLabel: "Exporter en PDF",
  },
  upload: {
    dashboardLabel: "Tableau de bord",
    title: "Démarrer l’analyse",
    description:
      "Importez votre CV et ajoutez l’offre d’emploi pour recevoir des recommandations personnalisées.",
    stepLabel: "1",
    heading: "Importez votre CV",
    supportText:
      "Importez la dernière version de votre CV. Les formats PDF et DOCX sont pris en charge.",
    dropzoneLabel: "Glissez-déposez votre CV ici",
    dropzoneSeparator: "ou",
    chooseFileLabel: "Choisir un fichier",
    fileTypesLabel: "PDF ou DOCX jusqu’à 10 Mo",
    uploadedFileLabel: "Fichier importé",
    mockFileName: "Edwin_Fom_Resume.pdf",
    mockFileMetadata: "245 Ko · Importé à l’instant",
    uploadedJustNowLabel: "Importé à l’instant",
    fileTypeLabel: "PDF",
    changeFileLabel: "Modifier",
    removeFileLabel: "Supprimer",
    emptyFileLabel: "Aucun fichier sélectionné",
    privacyLabel: "Vos fichiers sont sécurisés et privés. Nous ne les partageons jamais.",
    analyzeLabel: "Analyser la correspondance",
    analyzingLabel: "Analyse en cours…",
    analyzeDescription: "Recevez des recommandations personnalisées",
    sampleLabel: "Essayer les données d’exemple",
    sampleDescription: "Découvrez le fonctionnement avec un exemple",
    clearLabel: "Tout effacer",
    clearDescription: "Supprimer toutes les données saisies",
    workflow: {
      uploadTitle: "Importer le CV",
      uploadDescription: "Ajoutez votre CV au format PDF ou DOCX.",
      offerTitle: "Ajouter l’offre",
      offerDescription: "Collez l’URL ou la description du poste.",
      recommendationsTitle: "Recevoir les recommandations",
      recommendationsDescription:
        "Recevez des conseils IA pour adapter votre CV.",
    },
    invalidFileLabel: "Choisissez un fichier PDF ou DOCX inférieur à 10 Mo.",
  },
  jobOffer: {
    stepLabel: "2",
    heading: "Ajouter l’offre d’emploi",
    supportText:
      "Ajoutez l’offre avec une URL ou collez la description complète du poste.",
    urlLabel: "Coller l’URL de l’offre",
    urlPlaceholder: "https://entreprise.com/carrieres/12345",
    fetchLabel: "Récupérer",
    urlHint: "Nous extrairons automatiquement les détails du poste.",
    separatorLabel: "ou",
    descriptionLabel: "Coller la description du poste",
    descriptionPlaceholder: "Collez ici la description complète du poste...",
    previewLabel: "Aperçu analysé (exemple)",
    autoExtractedLabel: "Extrait automatiquement",
    roleLabel: "Poste",
    roleValue: "Ingénieur full-stack senior",
    companyLabel: "Entreprise",
    companyValue: "Acme Inc.",
    requirementsLabel: "Exigences clés",
    requirementsValue:
      "TypeScript, React, Node.js, PostgreSQL, AWS, Docker, CI/CD, API REST, communication.",
    previewNote:
      "Cet aperçu est un exemple. Cliquez sur « Analyser la correspondance » pour voir tous les détails extraits.",
  },
  analysisBenefits: {
    heading: "Ce que vous obtiendrez",
    description:
      "Notre IA analyse votre CV et l’offre pour fournir des recommandations concrètes.",
    sectionRecommendationsTitle: "Recommandations par section",
    sectionRecommendationsDescription:
      "Améliorez chaque partie de votre CV selon les exigences du poste.",
    skillsGapTitle: "Détection des lacunes",
    skillsGapDescription:
      "Identifiez les compétences manquantes et obtenez des suggestions adaptées.",
    projectPrioritizationTitle: "Priorisation des projets",
    projectPrioritizationDescription:
      "Mettez en avant les projets les plus pertinents pour ce poste.",
    atsOptimizationTitle: "Optimisation pour les ATS",
    atsOptimizationDescription:
      "Structurez votre CV pour réussir les analyses des ATS.",
    privacyTitle: "Approuvé par les professionnels",
    privacyDescription:
      "Vos données sont confidentielles et utilisées uniquement pour améliorer votre CV.",
  },
  studio: {
    jobOffer: {
      title: "Offre d’emploi",
      optionsLabel: "Options de l’offre",
      detectedRequirementsLabel: "Exigences détectées",
      matchedSummarySuffix: "correspondances",
      matchedLabel: "Correspondant",
      missingLabel: "Manquant",
      fullDescriptionLabel: "Voir la description complète du poste",
      priorityKeywordsLabel: "Mots-clés prioritaires",
      priorityKeywordsHint: "Glissez pour réorganiser la priorité",
    },
    cv: {
      title: "Votre CV",
      overviewLabel: "Vue d’ensemble",
      profileLabel: "Profil",
      experienceLabel: "Expérience",
      projectsLabel: "Projets",
      skillsLabel: "Compétences",
      displayOptionsLabel: "Options d’affichage",
      toggleGuidesLabel: "Afficher les repères de page",
      zoomOutLabel: "Réduire le zoom",
      zoomInLabel: "Augmenter le zoom",
      zoomLevelLabel: "Zoom de l’aperçu : {zoom} %",
      fitPreviewLabel: "Ajuster l’aperçu à l’écran",
      toggleCanvasThemeLabel: "Changer le thème de l’aperçu",
      previousPageLabel: "Page précédente",
      nextPageLabel: "Page suivante",
      pageIndicatorLabel: "Page {current} sur {total}",
    },
    recommendations: {
      title: "Recommandations IA",
      infoLabel: "À propos des recommandations IA",
      openLabel: "Ouvrir la recommandation",
      closeLabel: "Fermer la recommandation",
      currentLabel: "Actuel",
      suggestedImprovementLabel: "Amélioration suggérée",
      relevanceLabel: "+{value} % de pertinence",
      acceptLabel: "Accepter",
      editLabel: "Modifier",
      ignoreLabel: "Ignorer",
      acceptedLabel: "Acceptée",
      highImpactTitle: "Améliorations à fort impact",
      highImpactDescription: "Concentrez-vous sur ces changements pour améliorer votre correspondance",
      highImpactBadge: "Fort impact",
      items: {
        profile: {
          title: "Profil",
          description: "Renforcez votre résumé",
        },
        experience: {
          title: "Expérience",
          description: "Mettez en avant les réalisations pertinentes",
        },
        projects: {
          title: "Projets",
          description: "Présentez mieux votre travail",
        },
        skills: {
          title: "Compétences",
          description: "Ajoutez des compétences manquantes ou liées",
        },
      },
      improvements: {
        rewriteProfile: {
          title: "Réécrire le profil",
          description: "Rendez votre résumé très pertinent pour ce poste",
        },
        reorderProjects: {
          title: "Réorganiser les projets",
          description: "Placez en premier les projets qui correspondent au poste",
        },
        highlightPostgres: {
          title: "Mettre PostgreSQL en avant",
          description: "Soulignez votre expérience avec PostgreSQL",
        },
      },
    },
    copilot: {
      title: "Copilote IA",
      closeLabel: "Fermer le Copilote IA",
      workingWithLabel: "Vous travaillez avec",
      chatLabel: "Discussion",
      actionsLabel: "Actions",
      assistantLabel: "Copilote",
      userLabel: "Vous",
      greeting: "Bonjour Edwin ! 👋",
      greetingPrompt: "Je peux vous aider à adapter votre CV à ce poste. Que souhaitez-vous améliorer ?",
      sampleUserMessage: "Rendez mon expérience chez Softronic plus pertinente pour ce poste.",
      improvementsFoundLabel: "J’ai trouvé 3 améliorations à fort impact.",
      suggestedChangeTitle: "Softronic Innoving · Développeur full-stack",
      changedBulletsLabel: "3 puces seront mises à jour",
      impactLabel: "+12 % d’impact",
      changeBullets: [
        "Développer et maintenir des applications full-stack avec Next.js, Node.js, Prisma ORM et Microsoft SQL Server.",
        "Créer des intégrations d’API REST et optimiser les requêtes de données avec Microsoft SQL Server.",
        "Concevoir des solutions frontend et backend évolutives avec Next.js et Node.js.",
      ],
      detailedChangesLabel: "Voir les changements détaillés",
      applyChangesLabel: "Appliquer les changements",
      appliedLabel: "Changements appliqués",
      editLabel: "Modifier",
      ignoreLabel: "Ignorer",
      quickActionsLabel: "Autres actions rapides",
      improveProfileLabel: "Améliorer le profil",
      reorderProjectsLabel: "Réorganiser les projets",
      addExperienceLabel: "Ajouter une expérience",
      addSkillsLabel: "Ajouter des compétences",
      optimizeForJobLabel: "Optimiser pour ce poste",
      moreActionsLabel: "Plus d’actions",
      composerPlaceholder: "Demander au Copilote CV...",
      attachLabel: "Joindre un fichier",
      sendLabel: "Envoyer le message",
      reviewNotice: "Le Copilote peut faire des erreurs. Vérifiez avant d’appliquer.",
      responseMessage: "J’ai ajouté ceci à la liste de recommandations à examiner.",
      noActionsLabel: "Aucune action disponible.",
    },
  },
  resumeExport: {
    downloadLabel: "Télécharger le PDF",
    errorLabel: "Le PDF n’a pas pu être exporté. Veuillez réessayer.",
    exportingLabel: "Préparation du PDF…",
  },
  domainErrors: {
    UNSUPPORTED_FILE:
      "Ce type de fichier n'est pas pris en charge. Importez un CV PDF ou DOCX.",
    FILE_TOO_LARGE: "Ce fichier dépasse la limite de 10 Mo.",
    EMPTY_DOCUMENT: "Aucun texte lisible n'a été trouvé dans ce document.",
    TEXT_EXTRACTION_FAILED:
      "Le document n'a pas pu être lu. Réexportez-le en PDF ou DOCX.",
    INVALID_RESUME:
      "Ce document ne ressemble pas à un CV. Importez plutôt votre CV.",
    PARTIAL_EXTRACTION:
      "Seule une partie du CV a pu être structurée. Vérifiez le contenu importé.",
    INVALID_URL: "Ce lien d'offre n'est pas une URL valide.",
    UNREACHABLE_URL:
      "Impossible d'ouvrir cette page d'offre. Collez plutôt la description.",
    REQUEST_TIMEOUT:
      "La page d'offre a mis trop de temps à répondre. Collez plutôt la description.",
    NON_HTML_RESPONSE:
      "Ce lien ne pointe pas vers une page d'offre. Collez plutôt la description.",
    EMPTY_PAGE:
      "Cette page d'offre n'a retourné aucun contenu lisible. Collez plutôt la description.",
    BLOCKED_PAGE:
      "Ce site a bloqué la requête. Collez plutôt la description de l'offre.",
    NO_JOB_CONTENT:
      "Impossible d'extraire cette page d'offre. Collez plutôt la description.",
    EMPTY_DESCRIPTION:
      "Ajoutez d'abord une URL ou collez la description de l'offre.",
    INVALID_JOB_OFFER: "L'offre n'a pas pu être structurée à partir de ce contenu.",
    NETWORK_ERROR: "La requête n'a pas pu être envoyée. Vérifiez votre connexion.",
    REQUEST_FAILED: "La requête n'a pas pu aboutir. Veuillez réessayer.",
    UNKNOWN: "Une erreur est survenue. Veuillez réessayer.",
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
    languages: {
      title: "Langues",
      nativeLabel: "Langue maternelle",
    },
    interests: {
      title: "Centres d’intérêt",
    },
  },
} satisfies Messages;
