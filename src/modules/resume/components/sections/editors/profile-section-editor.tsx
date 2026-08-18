"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";
import { SpaciousTextarea } from "./spacious-textarea";

type ProfileSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  title: string;
  onClose: () => void;
}>;

export function ProfileSectionEditor({
  resume,
  dictionary,
  title,
  onClose,
}: ProfileSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const applyAction = useSessionStore((state) => state.applyAction);

  const [summary, setSummary] = useState(resume.profile.summary);
  const [highlightsText, setHighlightsText] = useState(
    resume.profile.highlights.join("\n"),
  );
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const highlights = highlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    await applyAction({
      type: "profile.update",
      summary,
      highlights,
    });
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
              Edit your professional bio and bullet point highlights
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

        <SpaciousTextarea
          label={inlineEdit.summaryLabel}
          value={summary}
          onChange={setSummary}
          dictionary={dictionary}
          rows={5}
          placeholder="Briefly describe your career background, expertise, and value proposition..."
          required
        />

        <SpaciousTextarea
          label={inlineEdit.highlightsLabel}
          value={highlightsText}
          onChange={setHighlightsText}
          dictionary={dictionary}
          rows={4}
          placeholder="• Proven experience building scalable platforms&#10;• Deep expertise in full-stack architecture"
        />

        <div className="sticky bottom-0 z-10 -mx-1 -mb-1 mt-4 flex items-center justify-end gap-2.5 border-t border-line-subtle bg-surface/95 px-2 py-3 backdrop-blur-xs">
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
        sectionId="profile"
        sectionTitle={title}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
