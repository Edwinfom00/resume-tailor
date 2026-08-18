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
        className="my-2 rounded-lg border border-brand bg-surface p-4 shadow-md transition-all duration-(--rt-duration-normal)"
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
      className="group relative cursor-pointer rounded-xs transition-all duration-(--rt-duration-fast) hover:outline hover:outline-2 hover:outline-brand/40"
    >
      <div className="pointer-events-none absolute -top-3 right-2 z-10 hidden items-center gap-1 rounded-pill bg-brand px-2.5 py-0.5 text-2xs font-semibold text-white shadow-xs group-hover:flex">
        <FiEdit2 aria-hidden="true" className="h-3 w-3" />
        <span>{inlineEdit.doubleClickHint}</span>
      </div>
      {children}
    </div>
  );
}

