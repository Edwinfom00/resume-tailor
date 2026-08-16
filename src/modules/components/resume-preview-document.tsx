"use client";

import { useMemo } from "react";
import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import {
  ResumeDocument,
  type ResumeDocumentBlock,
} from "./resume-document";
import { ResumeEducation } from "./sections/resume-education";
import { ResumeExperience } from "./sections/resume-experience";
import { ResumeHeader } from "./sections/resume-header";
import { ResumeProfile } from "./sections/resume-profile";
import { ResumeProjects } from "./sections/resume-projects";

type ResumePreviewDocumentProps = Readonly<{
  dictionary: Messages;
  resume: ResumeData;
}>;

export function ResumePreviewDocument({
  dictionary,
  resume,
}: ResumePreviewDocumentProps) {
  const educationTitle = dictionary.resume.education?.title;
  const blocks = useMemo<readonly ResumeDocumentBlock<ResumeData>[]>(
    () => [
      {
        id: "header",
        render: (data) => <ResumeHeader resume={data} />,
      },
      {
        id: "profile",
        render: (data) => (
          <ResumeProfile
            resume={data}
            title={dictionary.resume.profile.title}
          />
        ),
      },
      {
        id: "experience",
        render: (data) => (
          <ResumeExperience
            presentLabel={dictionary.resume.experience.presentLabel}
            resume={data}
            title={dictionary.resume.experience.title}
          />
        ),
      },
      {
        id: "projects",
        render: (data) => (
          <ResumeProjects
            resume={data}
            roleLabel={dictionary.resume.projects.roleLabel}
            technologiesLabel={dictionary.resume.projects.technologiesLabel}
            title={dictionary.resume.projects.title}
          />
        ),
      },
      ...(educationTitle
        ? [
            {
              id: "education",
              render: (data: ResumeData) => (
                <ResumeEducation resume={data} title={educationTitle} />
              ),
            },
          ]
        : []),
    ],
    [dictionary, educationTitle],
  );

  return <ResumeDocument blocks={blocks} data={resume} />;
}
