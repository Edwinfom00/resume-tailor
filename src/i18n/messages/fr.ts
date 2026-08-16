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
  resumeExport: {
    downloadLabel: "Télécharger le PDF",
    errorLabel: "Le PDF n’a pas pu être exporté. Veuillez réessayer.",
    exportingLabel: "Préparation du PDF…",
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
