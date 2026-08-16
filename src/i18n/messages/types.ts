export type Messages = {
  metadata: {
    title: string;
    description: string;
  };
  languageSwitcher: {
    label: string;
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
  };
};
