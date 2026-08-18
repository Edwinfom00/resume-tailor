"use client";

import { useRef, type TextareaHTMLAttributes } from "react";
import { FiList } from "react-icons/fi";
import type { Messages } from "@/i18n/messages/types";

type SpaciousTextareaProps = Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  dictionary: Messages;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}> & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">;

export function SpaciousTextarea({
  label,
  value,
  onChange,
  dictionary,
  rows = 4,
  placeholder,
  required,
  ...rest
}: SpaciousTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineEdit = dictionary.resume.inlineEdit;

  const linesCount = value ? value.split("\n").filter((l) => l.trim().length > 0).length : 0;

  const handleAddBullet = () => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value ? `${value}\n• ` : "• ");
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const needsNewline = before.length > 0 && !before.endsWith("\n");
    const insertText = `${needsNewline ? "\n" : ""}• `;

    const newValue = before + insertText + after;
    onChange(newValue);

    setTimeout(() => {
      el.focus();
      const newPos = start + insertText.length;
      el.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {linesCount > 0 ? (
            <span className="text-2xs font-medium text-ink-muted">
              {linesCount} {inlineEdit.bulletCountHint}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleAddBullet}
            className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2 py-0.5 text-2xs font-semibold text-ink-muted hover:bg-surface-brand hover:text-brand transition-colors border border-line-subtle"
          >
            <FiList className="h-3 w-3" />
            <span>{inlineEdit.addBullet}</span>
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full resize-y rounded-xl border border-line-subtle bg-canvas p-3.5 text-xs sm:text-sm text-ink leading-relaxed placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all shadow-2xs"
        {...rest}
      />
    </div>
  );
}
