"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData, ResumeSkillGroup } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

type SkillsSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  title: string;
  onClose: () => void;
}>;

type EditableSkillGroup = {
  name: string;
  skillsText: string;
};

function prepareEditableSkillGroups(groups: readonly ResumeSkillGroup[]): EditableSkillGroup[] {
  return groups.map((g) => ({
    name: g.name,
    skillsText: g.skills.map((s) => s.name).join(", "),
  }));
}

export function SkillsSectionEditor({
  resume,
  dictionary,
  title,
  onClose,
}: SkillsSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const applyAction = useSessionStore((state) => state.applyAction);
  const sendCopilotMessage = useSessionStore((state) => state.sendCopilotMessage);

  const [groups, setGroups] = useState<EditableSkillGroup[]>(
    prepareEditableSkillGroups(resume.skills),
  );
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

  const updateGroup = (index: number, changes: Partial<EditableSkillGroup>) => {
    setGroups((prev) =>
      prev.map((g, idx) => (idx === index ? { ...g, ...changes } : g)),
    );
  };

  const addGroup = () => {
    setGroups((prev) => [...prev, { name: "", skillsText: "" }]);
  };

  const removeGroup = (index: number) => {
    setGroups((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    for (const group of resume.skills) {
      for (const skill of group.skills) {
        await applyAction({ type: "skill.remove", skillName: skill.name });
      }
    }

    for (const group of groups) {
      const groupName = group.name.trim() || "Technical Skills";
      const skillNames = group.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const name of skillNames) {
        await applyAction({
          type: "skill.add",
          groupName,
          skill: { name },
        });
      }
    }

    onClose();
  };

  const handleAiEnhance = async () => {
    setIsAiEnhancing(true);
    try {
      await sendCopilotMessage(
        "Categorize, structure, and optimize my skills list based on job requirements.",
        "skills",
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

      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {groups.map((group, index) => (
          <div
            key={index}
            className="rounded-md border border-line-subtle bg-surface-subtle p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
                {inlineEdit.groupNameLabel} #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeGroup(index)}
                className="inline-flex items-center gap-1 text-2xs font-semibold text-danger hover:underline"
              >
                <FiTrash2 aria-hidden="true" className="h-3 w-3" />
                <span>{inlineEdit.removeItem}</span>
              </button>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.groupNameLabel}
              </label>
              <input
                type="text"
                value={group.name}
                onChange={(e) => updateGroup(index, { name: e.target.value })}
                className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-ink-muted">
                {inlineEdit.skillsLabel}
              </label>
              <input
                type="text"
                value={group.skillsText}
                onChange={(e) => updateGroup(index, { skillsText: e.target.value })}
                className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                required
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addGroup}
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
