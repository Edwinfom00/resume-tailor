"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiGlobe, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { LanguageProficiency, ResumeData, ResumeLanguage } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";

type LanguagesSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  title: string;
  onClose: () => void;
}>;

const proficiencyOptions: readonly LanguageProficiency[] = [
  "native",
  "C2",
  "C1",
  "B2",
  "B1",
  "A2",
  "A1",
];

export function LanguagesSectionEditor({
  resume,
  dictionary,
  title,
  onClose,
}: LanguagesSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const applyAction = useSessionStore((state) => state.applyAction);

  const [languages, setLanguages] = useState<ResumeLanguage[]>([...resume.languages]);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const updateLanguage = (index: number, changes: Partial<ResumeLanguage>) => {
    setLanguages((prev) =>
      prev.map((lang, idx) => (idx === index ? { ...lang, ...changes } : lang)),
    );
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    for (const lang of languages) {
      await applyAction({
        type: "language.update",
        languageName: lang.name,
        changes: {
          proficiency: lang.proficiency,
        },
      });
    }

    onClose();
  };

  return (
    <>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-3">
          <div>
            <h3 className="text-base font-bold text-ink">
              {inlineEdit.editingSectionTitle}: <span className="text-brand">{title}</span>
            </h3>
            <p className="text-xs text-ink-muted">
              Adjust language proficiency levels
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAiDialogOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-surface-brand px-4 text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white"
          >
            <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.aiEnhance}</span>
          </button>
        </div>

        <div className="space-y-3">
          {languages.map((lang, index) => (
            <div
              key={lang.name}
              className="flex items-center gap-4 rounded-md border border-line-subtle bg-surface-subtle/60 p-3 sm:p-4"
            >
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {inlineEdit.languageNameLabel}
                </label>
                <div className="flex items-center gap-2 font-semibold text-sm text-ink">
                  <FiGlobe className="h-4 w-4 text-brand" />
                  <span>{lang.name}</span>
                </div>
              </div>

              <div className="w-44 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {inlineEdit.proficiencyLabel}
                </label>
                <select
                  value={lang.proficiency}
                  onChange={(e) => updateLanguage(index, { proficiency: e.target.value as LanguageProficiency })}
                  className="w-full rounded-md border border-line-subtle bg-canvas px-3 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                >
                  {proficiencyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "native" ? "Native speaker" : opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-subtle pt-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-line-subtle px-4 text-xs font-semibold text-ink-muted hover:bg-surface-subtle transition-colors"
          >
            <FiX aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.cancel}</span>
          </button>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-brand px-5 text-xs font-semibold text-white hover:bg-brand-hover transition-all"
          >
            <FiCheck aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.saveChanges}</span>
          </button>
        </div>
      </form>

      <SectionAiEnhanceDialog
        isOpen={isAiDialogOpen}
        sectionId="languages"
        sectionTitle={title}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
