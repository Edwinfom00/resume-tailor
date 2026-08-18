"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData, ResumeProject } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

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
  const sendCopilotMessage = useSessionStore((state) => state.sendCopilotMessage);

  const [items, setItems] = useState<EditableProject[]>(
    prepareEditableProjects(resume.projects),
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

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

  const handleAiEnhance = async () => {
    setIsAiEnhancing(true);
    try {
      await sendCopilotMessage(
        "Refine tech stack descriptions and highlight impact metrics for my projects.",
        "projects",
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
                {inlineEdit.projectNameLabel} #{index + 1}
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
                  {inlineEdit.projectNameLabel}
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, { name: e.target.value })}
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
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.descriptionLabel}
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.technologiesLabel}
              </label>
              <input
                type="text"
                value={item.technologiesText}
                onChange={(e) => updateItem(index, { technologiesText: e.target.value })}
                className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.highlightsLabel}
              </label>
              <textarea
                rows={3}
                value={item.highlightsText}
                onChange={(e) => updateItem(index, { highlightsText: e.target.value })}
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
