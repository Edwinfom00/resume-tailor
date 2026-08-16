import type { ResumeData, ResumeLanguage } from "@/@types/resume-data";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeLanguagesProps = Readonly<{
  resume: ResumeData;
  title: string;
  nativeLabel: string;
}>;

type ResumeLanguageItemProps = Readonly<{
  language: ResumeLanguage;
  nativeLabel: string;
}>;

function getProficiencyLabel(language: ResumeLanguage, nativeLabel: string) {
  return language.proficiency === "native" ? nativeLabel : language.proficiency;
}

function ResumeLanguageItem({
  language,
  nativeLabel,
}: ResumeLanguageItemProps) {
  return (
    <p className="m-0 [font-size:var(--rt-font-size-resume-copy)] leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
      <span className="font-bold">{language.name}:</span>{" "}
      {getProficiencyLabel(language, nativeLabel)}
    </p>
  );
}

export function ResumeLanguages({
  resume,
  title,
  nativeLabel,
}: ResumeLanguagesProps) {
  return (
    <section>
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <div className="mt-3 space-y-1">
        {resume.languages.map((language) => (
          <ResumeLanguageItem
            key={language.name}
            language={language}
            nativeLabel={nativeLabel}
          />
        ))}
      </div>
    </section>
  );
}
