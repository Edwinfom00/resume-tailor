"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type { ResumeData, ResumeEducation } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

type EducationSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  title: string;
  onClose: () => void;
}>;

type EditableEducation = {
  id: string;
  institution: string;
  credential: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  highlightsText: string;
};

function prepareEditableEducation(educationList: readonly ResumeEducation[]): EditableEducation[] {
  return educationList.map((edu) => ({
    id: edu.id,
    institution: edu.institution,
    credential: edu.credential,
    fieldOfStudy: edu.fieldOfStudy ?? "",
    startYear: edu.period.start.year,
    endYear: edu.period.end?.year,
    highlightsText: edu.highlights.join("\n"),
  }));
}

export function EducationSectionEditor({
  resume,
  dictionary,
  title,
  onClose,
}: EducationSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const applyAction = useSessionStore((state) => state.applyAction);

  const [items, setItems] = useState<EditableEducation[]>(
    prepareEditableEducation(resume.education),
  );

  const updateItem = (index: number, changes: Partial<EditableEducation>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...changes } : item)),
    );
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    for (const item of items) {
      const highlights = item.highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      await applyAction({
        type: "education.update",
        itemId: item.id,
        changes: {
          institution: item.institution,
          credential: item.credential,
          fieldOfStudy: item.fieldOfStudy.trim() || undefined,
          period: {
            start: { year: Number(item.startYear) },
            end: item.endYear ? { year: Number(item.endYear) } : undefined,
          },
          highlights,
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

      <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-md border border-line-subtle bg-surface-subtle p-3 space-y-3"
          >
            <span className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.institutionLabel} #{index + 1}
            </span>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block text-2xs font-semibold text-ink-muted">
                  {inlineEdit.institutionLabel}
                </label>
                <input
                  type="text"
                  value={item.institution}
                  onChange={(e) => updateItem(index, { institution: e.target.value })}
                  className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-ink-muted">
                  {inlineEdit.credentialLabel}
                </label>
                <input
                  type="text"
                  value={item.credential}
                  onChange={(e) => updateItem(index, { credential: e.target.value })}
                  className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-ink-muted">
                  {inlineEdit.fieldOfStudyLabel}
                </label>
                <input
                  type="text"
                  value={item.fieldOfStudy}
                  onChange={(e) => updateItem(index, { fieldOfStudy: e.target.value })}
                  className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-ink-muted">
                  {inlineEdit.datesLabel} (Start Year)
                </label>
                <input
                  type="number"
                  value={item.startYear}
                  onChange={(e) => updateItem(index, { startYear: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.highlightsLabel}
              </label>
              <textarea
                rows={2}
                value={item.highlightsText}
                onChange={(e) => updateItem(index, { highlightsText: e.target.value })}
                className="mt-1 w-full resize-y rounded-md border border-line-subtle bg-canvas p-2 text-xs text-ink outline-none focus:border-brand"
              />
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
