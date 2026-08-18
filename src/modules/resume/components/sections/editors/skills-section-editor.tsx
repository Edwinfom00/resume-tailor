"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiCpu, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData, ResumeSkillGroup } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";

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

  const [groups, setGroups] = useState<EditableSkillGroup[]>(
    prepareEditableSkillGroups(resume.skills),
  );
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

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

  return (
    <>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-3">
          <div>
            <h3 className="text-base font-bold text-ink">
              {inlineEdit.editingSectionTitle}: <span className="text-brand">{title}</span>
            </h3>
            <p className="text-xs text-ink-muted">
              Organize skills into categories and manage skill tags
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

        <div className="space-y-4">
          {groups.map((group, index) => {
            const skillList = group.skillsText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <div
                key={index}
                className="rounded-2xl border border-line-subtle bg-surface-subtle/60 p-4 sm:p-5 space-y-4 hover:border-brand/30 transition-all"
              >
                <div className="flex items-center justify-between border-b border-line-subtle/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">
                      <FiCpu className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      {inlineEdit.groupNameLabel} #{index + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGroup(index)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger-50 transition-colors"
                  >
                    <FiTrash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{inlineEdit.removeItem}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.groupNameLabel}
                  </label>
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => updateGroup(index, { name: e.target.value })}
                    placeholder="e.g. Frontend Development, Databases, Cloud Infrastructure"
                    className="w-full rounded-md border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {inlineEdit.skillsLabel}
                  </label>
                  <input
                    type="text"
                    value={group.skillsText}
                    onChange={(e) => updateGroup(index, { skillsText: e.target.value })}
                    placeholder="TypeScript, React, Next.js, Node.js, GraphQL"
                    className="w-full rounded-md border border-line-subtle bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    required
                  />
                  {skillList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skillList.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-xs font-medium text-brand"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addGroup}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/40 bg-surface-brand/50 text-xs font-bold text-brand transition-all hover:bg-brand hover:text-white hover:border-brand"
        >
          <FiPlus aria-hidden="true" className="h-4 w-4" />
          <span>{inlineEdit.addItem}</span>
        </button>

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
        sectionId="skills"
        sectionTitle={title}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
