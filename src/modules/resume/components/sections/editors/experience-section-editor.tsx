"use client";

import { useState, type FormEvent } from "react";
import { FiBriefcase, FiCheck, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData, ResumeExperience, ResumeMonth } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";
import { SpaciousTextarea } from "./spacious-textarea";

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

  const [items, setItems] = useState<EditableExperience[]>(
    prepareEditableExperiences(resume.experiences),
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

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

  return (
    <>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-3">
          <div>
            <h3 className="text-base font-bold text-ink">
              {inlineEdit.editingSectionTitle}: <span className="text-brand">{title}</span>
            </h3>
            <p className="text-xs text-ink-muted">
              Add, edit, or remove work experience roles and achievements
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
                    <FiBriefcase className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.employerLabel} #{index + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger-50 transition-colors"
                >
                  <FiTrash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{inlineEdit.removeItem}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.employerLabel}
                  </label>
                  <input
                    type="text"
                    value={item.employer}
                    onChange={(e) => updateItem(index, { employer: e.target.value })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.roleLabel}
                  </label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateItem(index, { role: e.target.value })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.locationLabel} (City)
                  </label>
                  <input
                    type="text"
                    value={item.locationCity}
                    onChange={(e) => updateItem(index, { locationCity: e.target.value })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.locationLabel} (Country)
                  </label>
                  <input
                    type="text"
                    value={item.locationCountry}
                    onChange={(e) => updateItem(index, { locationCountry: e.target.value })}
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

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.datesLabel} (End Year)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      disabled={item.isCurrent}
                      value={item.endYear ?? ""}
                      onChange={(e) => updateItem(index, { endYear: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder={item.isCurrent ? "Present" : "Year"}
                      className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all disabled:opacity-50"
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={item.isCurrent}
                        onChange={(e) => updateItem(index, { isCurrent: e.target.checked })}
                        className="rounded text-brand focus:ring-brand"
                      />
                      <span>Current</span>
                    </label>
                  </div>
                </div>
              </div>

              <SpaciousTextarea
                label={inlineEdit.achievementsLabel}
                value={item.achievementsText}
                onChange={(text) => updateItem(index, { achievementsText: text })}
                dictionary={dictionary}
                rows={4}
                placeholder="• Engineered microservices handling 10k req/s&#10;• Reduced latency by 40% using Redis caching"
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
        sectionId="experience"
        sectionTitle={title}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
