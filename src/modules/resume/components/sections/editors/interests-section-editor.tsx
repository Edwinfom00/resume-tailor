"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiHeart, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";

type InterestsSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  title: string;
  onClose: () => void;
}>;

export function InterestsSectionEditor({
  resume,
  dictionary,
  title,
  onClose,
}: InterestsSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const setResumeData = useSessionStore((state) => state.loadSampleResume);

  const [interestsText, setInterestsText] = useState(
    resume.interests.map((item) => item.name).join(", "),
  );
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const handleSave = (event: FormEvent) => {
    event.preventDefault();

    const newInterests = interestsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((name) => ({ name }));

    setResumeData({
      ...resume,
      interests: newInterests,
    });

    onClose();
  };

  const tagList = interestsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-3">
          <div>
            <h3 className="text-base font-bold text-ink">
              {inlineEdit.editingSectionTitle}: <span className="text-brand">{title}</span>
            </h3>
            <p className="text-xs text-ink-muted">
              Add personal interests, hobbies, or passion projects
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

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            {inlineEdit.interestNameLabel} (comma-separated)
          </label>
          <div className="relative flex items-center">
            <FiHeart className="absolute left-3.5 h-4 w-4 text-brand pointer-events-none" />
            <input
              type="text"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="Open Source, Chess, Continuous Integration, Photography"
              className="w-full rounded-xl border border-line-subtle bg-canvas pl-10 pr-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              required
            />
          </div>
          {tagList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {tagList.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-medium text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

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
        sectionId="interests"
        sectionTitle={title}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
