"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData, ResumeExperience, ResumeMonth } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

type ExperienceSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  title: string;
  onClose: () => void;
}>;

type EditableExperience = {
  id: string;
  employer: string;
  role: string;
  locationCity: string;
  locationCountry: string;
  startYear: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
  isCurrent: boolean;
  achievementsText: string;
};

function prepareEditableExperiences(experiences: readonly ResumeExperience[]): EditableExperience[] {
  return experiences.map((exp) => ({
    id: exp.id,
    employer: exp.employer,
    role: exp.role,
    locationCity: exp.location?.city ?? "",
    locationCountry: exp.location?.country ?? "",
    startYear: exp.period.start.year,
    startMonth: exp.period.start.month,
    endYear: exp.period.end?.year,
    endMonth: exp.period.end?.month,
    isCurrent: !exp.period.end,
    achievementsText: exp.achievements.join("\n"),
  }));
}

export function ExperienceSectionEditor({
  resume,
  dictionary,
  title,
  onClose,
}: ExperienceSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const applyAction = useSessionStore((state) => state.applyAction);
  const sendCopilotMessage = useSessionStore((state) => state.sendCopilotMessage);

  const [items, setItems] = useState<EditableExperience[]>(
    prepareEditableExperiences(resume.experiences),
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

  const updateItem = (index: number, changes: Partial<EditableExperience>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...changes } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        employer: "",
        role: "",
        locationCity: "",
        locationCountry: "",
        startYear: new Date().getFullYear(),
        isCurrent: true,
        achievementsText: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const itemToRemove = items[index];
    if (itemToRemove && !itemToRemove.id.startsWith("exp-")) {
      setDeletedIds((prev) => [...prev, itemToRemove.id]);
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    for (const deleteId of deletedIds) {
      await applyAction({ type: "experience.delete", itemId: deleteId });
    }

    for (const item of items) {
      const achievements = item.achievementsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const period = {
        start: { year: Number(item.startYear), month: item.startMonth ? (Number(item.startMonth) as ResumeMonth) : undefined },
        end: item.isCurrent
          ? undefined
          : { year: Number(item.endYear || item.startYear), month: item.endMonth ? (Number(item.endMonth) as ResumeMonth) : undefined },
      };

      const location = {
        city: item.locationCity.trim() || undefined,
        country: item.locationCountry.trim() || undefined,
      };

      const isNew = item.id.startsWith("exp-");

      if (isNew) {
        await applyAction({
          type: "experience.create",
          experience: {
            employer: item.employer,
            role: item.role,
            location,
            period,
            achievements,
            technologies: [],
          },
        });
      } else {
        await applyAction({
          type: "experience.update",
          itemId: item.id,
          changes: {
            employer: item.employer,
            role: item.role,
            location,
            period,
            achievements,
          },
        });
      }
    }

    onClose();
  };

  const handleAiEnhance = async () => {
    setIsAiEnhancing(true);
    try {
      await sendCopilotMessage(
        "Enhance achievements, impact metrics, and action verbs across my work experiences.",
        "experience",
      );
    } finally {
      setIsAiEnhancing(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-center justify-between border-b border-line-subtle pb-2">
        <h3 className="text-sm font-bold text-ink">
          {inlineEdit.editingSectionTitle}: {title}
        </h3>
        <button
          type="button"
          onClick={handleAiEnhance}
          disabled={isAiEnhancing}
          className="inline-flex h-(--rt-control-height-sm) items-center gap-1.5 rounded-md bg-surface-brand px-3 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-50"
        >
          <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
          <span>{isAiEnhancing ? inlineEdit.aiEnhancing : inlineEdit.aiEnhance}</span>
        </button>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-md border border-line-subtle bg-surface-subtle p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
                {inlineEdit.employerLabel} #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 text-2xs font-semibold text-danger hover:underline"
              >
                <FiTrash2 aria-hidden="true" className="h-3 w-3" />
                <span>{inlineEdit.removeItem}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block text-2xs font-semibold text-ink-muted">
                  {inlineEdit.employerLabel}
                </label>
                <input
                  type="text"
                  value={item.employer}
                  onChange={(e) => updateItem(index, { employer: e.target.value })}
                  className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-ink-muted">
                  {inlineEdit.roleLabel}
                </label>
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => updateItem(index, { role: e.target.value })}
                  className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-ink-muted">
                  {inlineEdit.locationLabel} (City)
                </label>
                <input
                  type="text"
                  value={item.locationCity}
                  onChange={(e) => updateItem(index, { locationCity: e.target.value })}
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
                {inlineEdit.achievementsLabel}
              </label>
              <textarea
                rows={3}
                value={item.achievementsText}
                onChange={(e) => updateItem(index, { achievementsText: e.target.value })}
                className="mt-1 w-full resize-y rounded-md border border-line-subtle bg-canvas p-2 text-xs text-ink outline-none focus:border-brand"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex h-(--rt-control-height-sm) w-full items-center justify-center gap-1 rounded-md border border-dashed border-brand-line bg-surface-brand text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
      >
        <FiPlus aria-hidden="true" className="h-4 w-4" />
        <span>{inlineEdit.addItem}</span>
      </button>

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
