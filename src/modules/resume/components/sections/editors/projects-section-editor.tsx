"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiFolder, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData, ResumeProject } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";
import { SpaciousTextarea } from "./spacious-textarea";

type ProjectsSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  title: string;
  onClose: () => void;
}>;

type EditableProject = {
  id: string;
  name: string;
  role: string;
  description: string;
  technologiesText: string;
  highlightsText: string;
};

function prepareEditableProjects(projects: readonly ResumeProject[]): EditableProject[] {
  return projects.map((prj) => ({
    id: prj.id,
    name: prj.name,
    role: prj.role ?? "",
    description: prj.description,
    technologiesText: prj.technologies.join(", "),
    highlightsText: prj.highlights.join("\n"),
  }));
}

export function ProjectsSectionEditor({
  resume,
  dictionary,
  title,
  onClose,
}: ProjectsSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const applyAction = useSessionStore((state) => state.applyAction);

  const [items, setItems] = useState<EditableProject[]>(
    prepareEditableProjects(resume.projects),
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const updateItem = (index: number, changes: Partial<EditableProject>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...changes } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `prj-${Date.now()}`,
        name: "",
        role: "",
        description: "",
        technologiesText: "",
        highlightsText: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const itemToRemove = items[index];
    if (itemToRemove && !itemToRemove.id.startsWith("prj-")) {
      setDeletedIds((prev) => [...prev, itemToRemove.id]);
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    for (const deleteId of deletedIds) {
      await applyAction({ type: "project.delete", itemId: deleteId });
    }

    for (const item of items) {
      const technologies = item.technologiesText
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const highlights = item.highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const isNew = item.id.startsWith("prj-");

      if (isNew) {
        await applyAction({
          type: "project.create",
          project: {
            name: item.name,
            role: item.role.trim() || undefined,
            description: item.description,
            technologies,
            highlights,
            links: [],
          },
        });
      } else {
        await applyAction({
          type: "project.update",
          itemId: item.id,
          changes: {
            name: item.name,
            role: item.role.trim() || undefined,
            description: item.description,
            technologies,
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
              Add, edit, or remove project showcases and tech stacks
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAiDialogOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-surface-brand px-4 text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white shadow-xs"
          >
            <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.aiEnhance}</span>
          </button>
        </div>

        <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1.5 scrollbar-thin">
          {items.map((item, index) => {
            const techList = item.technologiesText
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-line-subtle bg-surface-subtle/60 p-4 sm:p-5 space-y-4 shadow-2xs hover:border-brand/30 transition-all"
              >
                <div className="flex items-center justify-between border-b border-line-subtle/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">
                      <FiFolder className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      {inlineEdit.projectNameLabel} #{index + 1}
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
                      {inlineEdit.projectNameLabel}
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-2xs"
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
                      className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.descriptionLabel}
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-2xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.technologiesLabel}
                  </label>
                  <input
                    type="text"
                    value={item.technologiesText}
                    onChange={(e) => updateItem(index, { technologiesText: e.target.value })}
                    placeholder="Next.js, TypeScript, TailwindCSS, Prisma"
                    className="w-full rounded-xl border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-2xs"
                  />
                  {techList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {techList.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-brand/10 px-2 py-0.5 text-2xs font-semibold text-brand"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <SpaciousTextarea
                  label={inlineEdit.highlightsLabel}
                  value={item.highlightsText}
                  onChange={(text) => updateItem(index, { highlightsText: text })}
                  dictionary={dictionary}
                  rows={3}
                  placeholder="• Built automated CI/CD pipeline reducing build time by 50%&#10;• Designed responsive glassmorphism UI components"
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/40 bg-surface-brand/50 text-xs font-bold text-brand transition-all hover:bg-brand hover:text-white hover:border-brand shadow-2xs"
        >
          <FiPlus aria-hidden="true" className="h-4 w-4" />
          <span>{inlineEdit.addItem}</span>
        </button>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-subtle pt-4">
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
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-brand px-5 text-xs font-semibold text-white shadow-brand hover:bg-brand-hover transition-all"
          >
            <FiCheck aria-hidden="true" className="h-4 w-4" />
            <span>{inlineEdit.saveChanges}</span>
          </button>
        </div>
      </form>

      <SectionAiEnhanceDialog
        isOpen={isAiDialogOpen}
        sectionId="projects"
        sectionTitle={title}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
