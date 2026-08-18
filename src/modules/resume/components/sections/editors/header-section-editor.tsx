"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";

type HeaderSectionEditorProps = Readonly<{
  resume: ResumeData;
  dictionary: Messages;
  onClose: () => void;
}>;

export function HeaderSectionEditor({
  resume,
  dictionary,
  onClose,
}: HeaderSectionEditorProps) {
  const inlineEdit = dictionary.resume.inlineEdit;
  const applyAction = useSessionStore((state) => state.applyAction);
  const sendCopilotMessage = useSessionStore((state) => state.sendCopilotMessage);

  const [name, setName] = useState(resume.identity.name);
  const [headline, setHeadline] = useState(resume.identity.headline);
  const [email, setEmail] = useState(resume.identity.contact.email);
  const [phone, setPhone] = useState(resume.identity.contact.phone ?? "");
  const [city, setCity] = useState(resume.identity.contact.location?.city ?? "");
  const [country, setCountry] = useState(resume.identity.contact.location?.country ?? "");
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    await applyAction({
      type: "header.update",
      name,
      headline,
      email,
      phone,
      location: {
        city,
        country,
        region: resume.identity.contact.location?.region,
        remote: resume.identity.contact.location?.remote,
        remoteStatus: resume.identity.contact.location?.remoteStatus,
      },
    });
    onClose();
  };

  const handleAiEnhance = async () => {
    setIsAiEnhancing(true);
    try {
      await sendCopilotMessage(
        "Refine and enhance my CV header identity and professional headline for high impact.",
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
          {inlineEdit.editingSectionTitle}: {name}
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-2xs font-semibold text-ink-muted">
            {inlineEdit.nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
            required
          />
        </div>

        <div>
          <label className="block text-2xs font-semibold text-ink-muted">
            {inlineEdit.headlineLabel}
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
            required
          />
        </div>

        <div>
          <label className="block text-2xs font-semibold text-ink-muted">
            {inlineEdit.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
            required
          />
        </div>

        <div>
          <label className="block text-2xs font-semibold text-ink-muted">
            {inlineEdit.phoneLabel}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-2xs font-semibold text-ink-muted">
            {inlineEdit.locationLabel} (City)
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-2xs font-semibold text-ink-muted">
            {inlineEdit.locationLabel} (Country)
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-md border border-line-subtle bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
          />
        </div>
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
