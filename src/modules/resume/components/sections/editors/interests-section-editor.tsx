"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

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

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-center justify-between border-b border-line-subtle pb-2">
        <h3 className="text-sm font-bold text-ink">
          {inlineEdit.editingSectionTitle}: {title}
        </h3>
      </div>

      <div>
        <label className="block text-2xs font-semibold text-ink-muted">
          {inlineEdit.interestNameLabel} (comma-separated)
        </label>
        <input
          type="text"
          value={interestsText}
          onChange={(e) => setInterestsText(e.target.value)}
          className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
          required
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
