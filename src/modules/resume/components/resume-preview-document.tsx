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
import { ResumeInterests } from "./sections/resume-interests";
import { ResumeLanguages } from "./sections/resume-languages";
import { ResumeProfile } from "./sections/resume-profile";
import { ResumeProjects } from "./sections/resume-projects";
import { ResumeSkills } from "./sections/resume-skills";

type ResumePreviewDocumentProps = Readonly<{
  dictionary: Messages;
  resume: ResumeData;
}>;

export function ResumePreviewDocument({
  dictionary,
  resume,
}: ResumePreviewDocumentProps) {
  const educationTitle = dictionary.resume.education?.title;
  const interestsTitle = dictionary.resume.interests?.title;
  const languages = dictionary.resume.languages;
  const skillsTitle = dictionary.resume.skills?.title;
  const blocks = useMemo<readonly ResumeDocumentBlock<ResumeData>[]>(
    () => [
      {
        id: "header",
        render: (data) => <ResumeHeader resume={data} dictionary={dictionary} />,
      },
      {
        id: "profile",
        render: (data) => (
          <ResumeProfile
            resume={data}
            title={dictionary.resume.profile.title}
            dictionary={dictionary}
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
            dictionary={dictionary}
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
            dictionary={dictionary}
          />
        ),
      },
      ...(educationTitle
        ? [
            {
              id: "education",
              render: (data: ResumeData) => (
                <ResumeEducation
                  resume={data}
                  title={educationTitle}
                  dictionary={dictionary}
                />
              ),
            },
          ]
        : []),
      ...(skillsTitle
        ? [
            {
              id: "skills",
              render: (data: ResumeData) => (
                <ResumeSkills
                  resume={data}
                  title={skillsTitle}
                  dictionary={dictionary}
                />
              ),
            },
          ]
        : []),
      ...(languages?.title
        ? [
            {
              id: "languages",
              render: (data: ResumeData) => (
                <ResumeLanguages
                  nativeLabel={languages.nativeLabel}
                  resume={data}
                  title={languages.title}
                  dictionary={dictionary}
                />
              ),
            },
          ]
        : []),
      ...(interestsTitle
        ? [
            {
              id: "interests",
              render: (data: ResumeData) => (
                <ResumeInterests
                  resume={data}
                  title={interestsTitle}
                  dictionary={dictionary}
                />
              ),
            },
          ]
        : []),
    ],
    [dictionary, educationTitle, interestsTitle, languages, skillsTitle],
  );

  return <ResumeDocument blocks={blocks} data={resume} />;
}
