"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

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
  const sendCopilotMessage = useSessionStore((state) => state.sendCopilotMessage);

  const [summary, setSummary] = useState(resume.profile.summary);
  const [highlightsText, setHighlightsText] = useState(
    resume.profile.highlights.join("\n"),
  );
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

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

  const handleAiEnhance = async () => {
    setIsAiEnhancing(true);
    try {
      await sendCopilotMessage(
        "Optimize and tailor my professional profile summary to align with target job requirements.",
        "profile",
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

      <div>
        <label className="block text-2xs font-semibold text-ink-muted">
          {inlineEdit.summaryLabel}
        </label>
        <textarea
          rows={5}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="mt-1 w-full resize-y rounded-md border border-line-subtle bg-canvas p-2 text-xs text-ink outline-none focus:border-brand"
          required
        />
      </div>

      <div>
        <label className="block text-2xs font-semibold text-ink-muted">
          {inlineEdit.highlightsLabel}
        </label>
        <textarea
          rows={3}
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
          className="mt-1 w-full resize-y rounded-md border border-line-subtle bg-canvas p-2 text-xs text-ink outline-none focus:border-brand"
        />
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
