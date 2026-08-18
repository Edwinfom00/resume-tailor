"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiGlobe, FiMail, FiMapPin, FiPhone, FiUser, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { SectionAiEnhanceDialog } from "./section-ai-enhance-dialog";

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

  const existingWebsite = resume.identity.contact.links.find((l) => l.kind === "website");

  const [name, setName] = useState(resume.identity.name);
  const [headline, setHeadline] = useState(resume.identity.headline);
  const [email, setEmail] = useState(resume.identity.contact.email);
  const [phone, setPhone] = useState(resume.identity.contact.phone ?? "");
  const [city, setCity] = useState(resume.identity.contact.location?.city ?? "");
  const [country, setCountry] = useState(resume.identity.contact.location?.country ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(existingWebsite?.url ?? "");
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    const otherLinks = resume.identity.contact.links.filter((l) => l.kind !== "website");
    const cleanUrl = websiteUrl.trim();
    const links = cleanUrl
      ? [
        ...otherLinks,
        {
          kind: "website" as const,
          label: cleanUrl.replace(/^https?:\/\/(www\.)?/i, ""),
          url: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`,
        },
      ]
      : otherLinks;

    await applyAction({
      type: "header.update",
      name,
      headline,
      email,
      phone,
      links,
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

  return (
    <>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-3">
          <div>
            <h3 className="text-base font-bold text-ink">
              {inlineEdit.editingSectionTitle}: <span className="text-brand">{name}</span>
            </h3>
            <p className="text-xs text-ink-muted">
              Update identity, title, contact details, and website portfolio
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.nameLabel}
            </label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3 h-4 w-4 text-ink-muted pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-line-subtle bg-canvas pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.headlineLabel}
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded-md border border-line-subtle bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.emailLabel}
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3 h-4 w-4 text-ink-muted pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-line-subtle bg-canvas pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.phoneLabel}
            </label>
            <div className="relative flex items-center">
              <FiPhone className="absolute left-3 h-4 w-4 text-ink-muted pointer-events-none" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-line-subtle bg-canvas pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.locationLabel} (City)
            </label>
            <div className="relative flex items-center">
              <FiMapPin className="absolute left-3 h-4 w-4 text-ink-muted pointer-events-none" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-md border border-line-subtle bg-canvas pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.locationLabel} (Country)
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border border-line-subtle bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              {inlineEdit.websiteLabel}
            </label>
            <div className="relative flex items-center">
              <FiGlobe className="absolute left-3 h-4 w-4 text-ink-muted pointer-events-none" />
              <input
                type="text"
                placeholder="https://www.yourdomain.dev"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full rounded-md border border-line-subtle bg-canvas pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>
        </div>

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
        sectionId="header"
        sectionTitle={titleCase(name || "Header")}
        dictionary={dictionary}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}

function titleCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
