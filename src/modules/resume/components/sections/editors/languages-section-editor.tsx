"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type { LanguageProficiency, ResumeData, ResumeLanguage } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

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
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-center justify-between border-b border-line-subtle pb-2">
        <h3 className="text-sm font-bold text-ink">
          {inlineEdit.editingSectionTitle}: {title}
        </h3>
      </div>

      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={lang.name} className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.languageNameLabel}
              </label>
              <input
                type="text"
                value={lang.name}
                readOnly
                className="mt-1 w-full rounded-md border border-line-subtle bg-surface-subtle px-2.5 py-1 text-xs text-ink outline-none"
              />
            </div>

            <div className="flex-1">
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.proficiencyLabel}
              </label>
              <select
                value={lang.proficiency}
                onChange={(e) => updateLanguage(index, { proficiency: e.target.value as LanguageProficiency })}
                className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
              >
                {proficiencyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-line-subtle pt-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-(--rt-control-height-sm) items-center gap-1 rounded-md border border-line-subtle px-3 text-xs font-semibold text-ink-muted hover:bg-surface-subtle"
        >
          <FiX aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{inlineEdit.cancel}</span>
        </button>
        <button
          type="submit"
          className="inline-flex h-(--rt-control-height-sm) items-center gap-1 rounded-md bg-brand px-3 text-xs font-semibold text-white hover:bg-brand-hover"
        >
          <FiCheck aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{inlineEdit.saveChanges}</span>
        </button>
      </div>
    </form>
  );
}
