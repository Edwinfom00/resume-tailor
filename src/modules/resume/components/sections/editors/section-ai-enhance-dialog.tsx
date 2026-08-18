"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";
import type { AnalysisSectionId } from "@/modules/analysis/domain/analysis-types";
import { useSessionStore } from "@/modules/session/state/session-store";

type SectionAiEnhanceDialogProps = Readonly<{
  isOpen: boolean;
  sectionId: "header" | "profile" | "experience" | "projects" | "education" | "skills" | "languages" | "interests";
  sectionTitle: string;
  dictionary: Messages;
  onClose: () => void;
}>;

const sectionPresets: Record<
  SectionAiEnhanceDialogProps["sectionId"],
  readonly string[]
> = {
  header: [
    "Refine headline for high executive impact",
    "Tailor professional headline to job target",
    "Make headline punchy and concise",
  ],
  profile: [
    "Highlight technical leadership & measurable impact",
    "Tailor summary to match target job description",
    "Make summary punchy and ATS-optimized",
    "Emphasize years of experience & key domains",
  ],
  experience: [
    "Quantify achievements with metrics and percentages",
    "Use strong action verbs for every bullet point",
    "Align work experiences with target job keywords",
    "Structure responsibilities cleanly with metrics",
  ],
  projects: [
    "Highlight core tech stack & architecture",
    "Quantify user scale, performance & outcome",
    "Emphasize key features & problem solved",
  ],
  education: [
    "Highlight key honors, GPA & relevant coursework",
    "Structure academic credentials professionally",
  ],
  skills: [
    "Categorize technical skills logically",
    "Extract and highlight top job keywords",
    "Group into core stack, tools & frameworks",
  ],
  languages: [
    "Standardize proficiency levels to CEFR standards",
  ],
  interests: [
    "Refine interests to highlight teamwork & curiosity",
  ],
};

export function SectionAiEnhanceDialog({
  isOpen,
  sectionId,
  sectionTitle,
  dictionary,
  onClose,
}: SectionAiEnhanceDialogProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const sendCopilotMessage = useSessionStore((state) => state.sendCopilotMessage);

  const [promptText, setPromptText] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const presets = sectionPresets[sectionId] ?? [];

  const handleSelectPreset = (preset: string) => {
    setSelectedPreset((prev) => (prev === preset ? null : preset));
  };

  const handleGenerate = async () => {
    setIsSubmitting(true);
    try {
      const parts = [
        selectedPreset ? `Focus: ${selectedPreset}.` : "",
        promptText.trim(),
      ].filter(Boolean);

      const finalPrompt = parts.length > 0 
        ? parts.join(" ") 
        : `Refine and optimize my ${sectionTitle} section for high impact.`;

      const targetSection: AnalysisSectionId | undefined =
        sectionId === "profile" || sectionId === "experience" || sectionId === "projects" || sectionId === "skills"
          ? sectionId
          : undefined;

      await sendCopilotMessage(finalPrompt, targetSection);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-line-subtle bg-surface p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-line-subtle pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-brand text-brand">
              <HiMiniSparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink leading-tight">
                {inlineEdit.aiAssistantTitle}
              </h3>
              <p className="text-xs text-ink-muted">
                {sectionTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-subtle hover:text-ink transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {presets.length > 0 ? (
          <div className="space-y-2">
            <span className="block text-2xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.aiPresetsTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-brand text-white shadow-2xs"
                        : "bg-surface-subtle text-ink-muted hover:bg-surface-brand hover:text-brand border border-line-subtle"
                    }`}
                  >
                    <HiMiniSparkles className="h-3 w-3" />
                    <span>{preset}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink-muted">
            Custom Instructions / Raw Notes (Optional)
          </label>
          <textarea
            rows={4}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={inlineEdit.aiPromptPlaceholder}
            className="w-full resize-none rounded-xl border border-line-subtle bg-canvas p-3 text-xs text-ink placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-subtle pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-line-subtle px-4 text-xs font-semibold text-ink-muted hover:bg-surface-subtle transition-colors disabled:opacity-50"
          >
            {inlineEdit.cancel}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-xs font-semibold text-white shadow-brand hover:bg-brand-hover transition-all disabled:opacity-50"
          >
            <HiMiniSparkles className="h-4 w-4" />
            <span>{isSubmitting ? inlineEdit.aiEnhancing : inlineEdit.aiGenerateBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
