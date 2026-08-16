import type { Messages } from "@/i18n/messages/types";

export const messages = {
  metadata: {
    title: "Resume Tailor",
    description: "Create targeted resumes for the opportunities that matter.",
  },
  languageSwitcher: {
    label: "Choose language",
  },
  navigation: {
    homeLabel: "Resume Tailor home",
    primaryLabel: "Primary navigation",
    features: "Features",
    howItWorks: "How it works",
    benefits: "Benefits",
    pricing: "Pricing",
    resources: "Resources",
    getStarted: "Get Started",
  },
  workspaceHeader: {
    homeLabel: "Resume Tailor home",
    searchLabel: "Search jobs, keywords or suggestions",
    searchPlaceholder: "Search jobs, keywords or suggestions...",
    searchShortcutLabel: "Command K",
    matchLabel: "Match",
    matchValue: "--%",
    exportLabel: "Export PDF",
  },
  upload: {
    dashboardLabel: "Dashboard",
    title: "Start analysis",
    description:
      "Upload your resume and add the job offer to get personalized recommendations.",
    stepLabel: "1",
    heading: "Upload your resume",
    supportText:
      "Upload the latest version of your resume. We support PDF and DOCX formats.",
    dropzoneLabel: "Drag & drop your resume here",
    dropzoneSeparator: "or",
    chooseFileLabel: "Choose file",
    fileTypesLabel: "PDF or DOCX up to 10MB",
    uploadedFileLabel: "Uploaded file",
    mockFileName: "Edwin_Fom_Resume.pdf",
    mockFileMetadata: "245 KB · Uploaded just now",
    uploadedJustNowLabel: "Uploaded just now",
    fileTypeLabel: "PDF",
    changeFileLabel: "Change",
    removeFileLabel: "Remove",
    emptyFileLabel: "No file selected",
    privacyLabel: "Your files are secure and private. We never share your data.",
    analyzeLabel: "Analyze match",
    analyzingLabel: "Analyzing…",
    analyzeDescription: "Get your personalized recommendations",
    sampleLabel: "Try sample data",
    sampleDescription: "See how it works with example",
    clearLabel: "Clear all",
    clearDescription: "Remove all inputs",
    workflow: {
      uploadTitle: "Upload CV",
      uploadDescription: "Add your resume in PDF or DOCX format.",
      offerTitle: "Add job offer",
      offerDescription: "Paste the job URL or description.",
      recommendationsTitle: "Get recommendations",
      recommendationsDescription: "Receive AI-powered insights to tailor your resume.",
    },
    invalidFileLabel: "Choose a PDF or DOCX file smaller than 10MB.",
  },
  jobOffer: {
    stepLabel: "2",
    heading: "Add job offer",
    supportText: "Add the job posting using a URL or paste the full job description.",
    urlLabel: "Paste job offer URL",
    urlPlaceholder: "https://company.com/careers/12345",
    fetchLabel: "Fetch",
    urlHint: "We'll extract the job details automatically.",
    separatorLabel: "or",
    descriptionLabel: "Paste job description",
    descriptionPlaceholder: "Paste the full job description here...",
    previewLabel: "Parsed preview (sample)",
    autoExtractedLabel: "Auto-extracted",
    roleLabel: "Role",
    roleValue: "Senior Full-Stack Engineer",
    companyLabel: "Company",
    companyValue: "Acme Inc.",
    requirementsLabel: "Key requirements",
    requirementsValue:
      "TypeScript, React, Node.js, PostgreSQL, AWS, Docker, CI/CD, REST APIs, communication.",
    previewNote:
      "Preview is a sample. Click “Analyze match” to see full extracted details.",
  },
  analysisBenefits: {
    heading: "What you'll get",
    description:
      "Our AI analyzes your resume and the job offer to deliver actionable insights.",
    sectionRecommendationsTitle: "Section-by-section recommendations",
    sectionRecommendationsDescription:
      "Improve each part of your resume based on the job requirements.",
    skillsGapTitle: "Skills gap detection",
    skillsGapDescription:
      "Identify missing skills and get suggestions to strengthen your fit.",
    projectPrioritizationTitle: "Project prioritization",
    projectPrioritizationDescription:
      "Highlight the projects that matter most for this role.",
    atsOptimizationTitle: "ATS-friendly optimization",
    atsOptimizationDescription:
      "Ensure your resume is structured to pass ATS scans with ease.",
    privacyTitle: "Trusted by professionals",
    privacyDescription:
      "Your data is confidential and used only to improve your resume.",
  },
  studio: {
    jobOffer: {
      title: "Job Offer",
      optionsLabel: "Job offer options",
      detectedRequirementsLabel: "Detected requirements",
      matchedSummarySuffix: "matched",
      matchedLabel: "Matched",
      missingLabel: "Missing",
      fullDescriptionLabel: "View full job description",
      priorityKeywordsLabel: "Priority keywords",
      priorityKeywordsHint: "Drag to reorder priority",
    },
    cv: {
      title: "Your CV",
      overviewLabel: "Overview",
      profileLabel: "Profile",
      experienceLabel: "Experience",
      projectsLabel: "Projects",
      skillsLabel: "Skills",
      displayOptionsLabel: "Display options",
      toggleGuidesLabel: "Toggle page guides",
      zoomOutLabel: "Zoom out",
      zoomInLabel: "Zoom in",
      zoomLevelLabel: "Preview zoom: {zoom}%",
      fitPreviewLabel: "Fit preview to screen",
      toggleCanvasThemeLabel: "Toggle preview canvas theme",
      previousPageLabel: "Previous page",
      nextPageLabel: "Next page",
      pageIndicatorLabel: "Page {current} of {total}",
    },
    recommendations: {
      title: "AI Recommendations",
      infoLabel: "About AI recommendations",
      openLabel: "Open recommendation",
      closeLabel: "Close recommendation",
      currentLabel: "Current",
      suggestedImprovementLabel: "Suggested improvement",
      relevanceLabel: "+{value}% relevance",
      acceptLabel: "Accept",
      editLabel: "Edit",
      ignoreLabel: "Ignore",
      acceptedLabel: "Accepted",
      highImpactTitle: "High Impact Improvements",
      highImpactDescription: "Focus on these changes to boost your match",
      highImpactBadge: "High impact",
      items: {
        profile: {
          title: "Profile",
          description: "Strengthen your summary",
        },
        experience: {
          title: "Experience",
          description: "Highlight relevant achievements",
        },
        projects: {
          title: "Projects",
          description: "Better showcase your work",
        },
        skills: {
          title: "Skills",
          description: "Add missing or related skills",
        },
      },
      improvements: {
        rewriteProfile: {
          title: "Rewrite profile",
          description: "Make your summary highly relevant to this role",
        },
        reorderProjects: {
          title: "Reorder projects",
          description: "Lead with projects that match the job",
        },
        highlightPostgres: {
          title: "Highlight PostgreSQL",
          description: "Emphasize your PostgreSQL experience",
        },
      },
    },
  },
  resumeExport: {
    downloadLabel: "Download PDF",
    errorLabel: "The PDF could not be exported. Please try again.",
    exportingLabel: "Preparing PDF…",
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
    skills: {
      title: "Skills",
    },
    languages: {
      title: "Languages",
      nativeLabel: "Native speaker",
    },
    interests: {
      title: "Interests",
    },
  },
} satisfies Messages;
