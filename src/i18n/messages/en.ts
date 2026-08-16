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
