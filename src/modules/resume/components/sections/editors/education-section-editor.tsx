"use client";

import { useState, type FormEvent } from "react";
import { FiBookOpen, FiCheck, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData, ResumeEducation } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";
import { SpaciousTextarea } from "./spacious-textarea";

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
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const updateItem = (index: number, changes: Partial<EditableEducation>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...changes } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `edu-${Date.now()}`,
        institution: "",
        credential: "",
        fieldOfStudy: "",
        startYear: new Date().getFullYear(),
        highlightsText: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const itemToRemove = items[index];
    if (itemToRemove && !itemToRemove.id.startsWith("edu-")) {
      setDeletedIds((prev) => [...prev, itemToRemove.id]);
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    for (const deleteId of deletedIds) {
      await applyAction({ type: "education.delete", itemId: deleteId });
    }

    for (const item of items) {
      const highlights = item.highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const isNew = item.id.startsWith("edu-");

      if (isNew) {
        await applyAction({
          type: "education.create",
          education: {
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
      } else {
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
              Add, edit, or remove degrees, institutions, and academic highlights
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAiDialogOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-surface-brand px-4 text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white"
          >
            <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.aiEnhance}</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-line-subtle bg-surface-subtle/60 p-4 sm:p-5 space-y-4 hover:border-brand/30 transition-all"
            >
              <div className="flex items-center justify-between border-b border-line-subtle/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">
                    <FiBookOpen className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.institutionLabel} #{index + 1}
                  </span>
                </div>
                {items.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger-50 transition-colors"
                  >
                    <FiTrash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{inlineEdit.removeItem}</span>
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.institutionLabel}
                  </label>
                  <input
                    type="text"
                    value={item.institution}
                    onChange={(e) => updateItem(index, { institution: e.target.value })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.credentialLabel}
                  </label>
                  <input
                    type="text"
                    value={item.credential}
                    onChange={(e) => updateItem(index, { credential: e.target.value })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.fieldOfStudyLabel}
                  </label>
                  <input
                    type="text"
                    value={item.fieldOfStudy}
                    onChange={(e) => updateItem(index, { fieldOfStudy: e.target.value })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.datesLabel} (Start Year)
                  </label>
                  <input
                    type="number"
                    value={item.startYear}
                    onChange={(e) => updateItem(index, { startYear: Number(e.target.value) })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    required
                  />
                </div>
              </div>

              <SpaciousTextarea
                label={inlineEdit.highlightsLabel}
                value={item.highlightsText}
                onChange={(text) => updateItem(index, { highlightsText: text })}
                dictionary={dictionary}
                rows={3}
                placeholder="• Graduated with Highest Honors&#10;• Specialized in Distributed Systems & AI"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/40 bg-surface-brand/50 text-xs font-bold text-brand transition-all hover:bg-brand hover:text-white hover:border-brand"
        >
          <FiPlus aria-hidden="true" className="h-4 w-4" />
          <span>{inlineEdit.addItem}</span>
        </button>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-subtle pt-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-line-subtle px-4 text-xs font-semibold text-ink-muted hover:bg-surface-subtle transition-colors"
          >
            <FiX aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.cancel}</span>
          </button>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-brand px-5 text-xs font-semibold text-white hover:bg-brand-hover transition-all"
          >
            <FiCheck aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.saveChanges}</span>
          </button>
        </div>
      </form>

      <SectionAiEnhanceDialog
        isOpen={isAiDialogOpen}
        sectionId="education"
        sectionTitle={title}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
