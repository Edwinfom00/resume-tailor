"use client";

import { useState, type ReactNode } from "react";
import { FiEdit2 } from "react-icons/fi";
import type { Messages } from "@/i18n/messages/types";

type SectionEditWrapperProps = Readonly<{
  children: ReactNode;
  editor: (props: { onClose: () => void }) => ReactNode;
  dictionary: Messages;
  sectionId: string;
}>;

export function SectionEditWrapper({
  children,
  editor,
  dictionary,
  sectionId,
}: SectionEditWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inlineEdit = dictionary.resume.inlineEdit;

  if (isEditing) {
    return (
      <div
        data-resume-section={sectionId}
        data-editing-section={sectionId}
        className="my-4 rounded-2xl border-2 border-brand/60 bg-surface p-5 sm:p-6 transition-all duration-200"
      >
        {editor({ onClose: () => setIsEditing(false) })}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onDoubleClick={() => setIsEditing(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          setIsEditing(true);
        }
      }}
      className="group relative cursor-pointer rounded-lg transition-all duration-150 hover:ring-2 hover:ring-brand/40 hover:bg-brand/5"
    >
      <div className="pointer-events-none absolute -top-3.5 right-3 z-10 hidden items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-2xs font-semibold text-white transition-all group-hover:flex animate-in fade-in zoom-in-90 duration-150">
        <FiEdit2 aria-hidden="true" className="h-3 w-3" />
        <span>{inlineEdit.doubleClickHint}</span>
      </div>
      {children}
    </div>
  );
}
