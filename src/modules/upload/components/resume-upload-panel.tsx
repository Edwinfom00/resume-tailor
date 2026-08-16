"use client";

import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import {
  FiFileText,
  FiEdit2,
  FiShield,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";

type ResumeUploadPanelProps = Readonly<{
  messages: Messages["upload"];
}>;

type UploadedFile = Readonly<{
  name: string;
  metadata: string;
  type: string;
}>;

const maximumFileSize = 10 * 1024 * 1024;

function createMockFile(messages: Messages["upload"]): UploadedFile {
  return {
    name: messages.mockFileName,
    metadata: messages.mockFileMetadata,
    type: messages.fileTypeLabel,
  };
}

function isSupportedFile(file: File) {
  return /\.(pdf|docx)$/i.test(file.name) && file.size <= maximumFileSize;
}

function createUploadedFile(
  file: File,
  messages: Messages["upload"],
): UploadedFile {
  const sizeInKilobytes = Math.max(1, Math.round(file.size / 1024));

  return {
    name: file.name,
    metadata: `${sizeInKilobytes} KB · ${messages.uploadedJustNowLabel}`,
    type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX",
  };
}

export function ResumeUploadPanel({ messages }: ResumeUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(() =>
    createMockFile(messages),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chooseFile = () => inputRef.current?.click();

  const acceptFile = (file: File) => {
    if (!isSupportedFile(file)) {
      setErrorMessage(messages.invalidFileLabel);
      return;
    }

    setUploadedFile(createUploadedFile(file, messages));
    setErrorMessage(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);

    if (file) {
      acceptFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const [file] = Array.from(event.dataTransfer.files);

    if (file) {
      acceptFile(file);
    }
  };

  const handleDropzoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseFile();
    }
  };

  const handleAnalyze = () => {
    if (!uploadedFile) {
      return;
    }

    setIsAnalyzing(true);
    window.setTimeout(() => setIsAnalyzing(false), 700);
  };

  return (
    <div className="w-full max-w-(--rt-upload-column-width)">
      <div className="rounded-xl border border-line-subtle bg-surface p-(--rt-space-5) shadow-xs">
        <div className="flex items-center gap-(--rt-space-3)">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-brand">
            {messages.stepLabel}
          </span>
          <h2 className="text-lg font-bold tracking-tight text-ink">
            {messages.heading}
          </h2>
        </div>

        <p className="mt-(--rt-space-3) text-sm text-ink-muted">
          {messages.supportText}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={handleFileChange}
        />

        <div
          role="button"
          tabIndex={0}
          aria-label={messages.chooseFileLabel}
          onClick={chooseFile}
          onKeyDown={handleDropzoneKeyDown}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-(--rt-space-6) flex min-h-(--rt-upload-dropzone-min-height) cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-(--rt-space-6) text-center transition-colors duration-(--rt-duration-fast) ${
            isDragging
              ? "border-brand bg-surface-brand"
              : "border-brand-line bg-surface"
          }`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-brand text-brand">
            <FiUpload aria-hidden="true" className="h-8 w-8" />
          </span>
          <p className="mt-(--rt-space-5) text-base font-bold text-ink">
            {messages.dropzoneLabel}
          </p>
          <span className="my-(--rt-space-2) flex items-center gap-(--rt-space-3) text-xs text-ink-muted before:h-px before:w-7 before:bg-line-subtle after:h-px after:w-7 after:bg-line-subtle">
            {messages.dropzoneSeparator}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              chooseFile();
            }}
            className="inline-flex h-(--rt-control-height-sm) items-center justify-center rounded-md bg-brand px-(--rt-space-6) text-sm font-semibold text-white shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover"
          >
            {messages.chooseFileLabel}
          </button>
          <p className="mt-(--rt-space-3) text-xs text-ink-muted">
            {messages.fileTypesLabel}
          </p>
        </div>

        {errorMessage ? (
          <p className="mt-(--rt-space-3) text-sm text-negative" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-(--rt-space-5)">
          <p className="text-xs font-bold text-ink">{messages.uploadedFileLabel}</p>
          {uploadedFile ? (
            <div className="mt-(--rt-space-2) flex min-h-(--rt-upload-file-row-min-height) items-center gap-(--rt-space-3) rounded-lg border border-line-subtle px-(--rt-space-3) shadow-xs">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-negative-subtle text-negative">
                <FiFileText aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-ink-muted">{uploadedFile.metadata}</p>
              </div>
              <span className="hidden rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-xs font-medium text-positive sm:inline">
                {uploadedFile.type}
              </span>
              <button
                type="button"
                onClick={chooseFile}
                className="inline-flex items-center gap-1 rounded-md p-1 text-xs font-semibold text-brand transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
              >
                <FiEdit2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{messages.changeFileLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="inline-flex items-center gap-1 rounded-md p-1 text-xs font-semibold text-negative transition-colors duration-(--rt-duration-fast) hover:bg-negative-subtle"
              >
                <FiTrash2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{messages.removeFileLabel}</span>
              </button>
            </div>
          ) : (
            <div className="mt-(--rt-space-2) flex min-h-(--rt-upload-file-row-min-height) items-center gap-(--rt-space-3) rounded-lg border border-line-subtle px-(--rt-space-3) text-sm text-ink-muted">
              <FiFileText aria-hidden="true" className="h-5 w-5" />
              <span>{messages.emptyFileLabel}</span>
            </div>
          )}
        </div>

        <div className="mt-(--rt-space-5) flex items-center gap-(--rt-space-2) text-xs text-ink-muted">
          <FiShield aria-hidden="true" className="h-4 w-4 shrink-0" />
          <p>{messages.privacyLabel}</p>
        </div>
      </div>

      <div className="mt-(--rt-space-5) grid grid-cols-1 gap-(--rt-space-3) rounded-xl border border-line-subtle bg-surface p-(--rt-space-4) shadow-xs sm:grid-cols-2">
        <button
          type="button"
          disabled={!uploadedFile || isAnalyzing}
          onClick={handleAnalyze}
          className="flex min-h-16 items-center gap-(--rt-space-3) rounded-md bg-brand px-(--rt-space-4) text-left text-white shadow-brand transition-opacity duration-(--rt-duration-fast) hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiSparkles aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span>
            <span className="block text-sm font-semibold">
              {isAnalyzing ? messages.analyzingLabel : messages.analyzeLabel}
            </span>
            <span className="block text-xs text-brand-subtle">
              {messages.analyzeDescription}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadedFile(createMockFile(messages));
            setErrorMessage(null);
          }}
          className="flex min-h-16 items-center gap-(--rt-space-3) rounded-md border border-line-subtle bg-surface px-(--rt-space-4) text-left text-ink shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
        >
          <FiFileText aria-hidden="true" className="h-5 w-5 shrink-0 text-ink-muted" />
          <span>
            <span className="block text-sm font-semibold">{messages.sampleLabel}</span>
            <span className="block text-xs text-ink-muted">
              {messages.sampleDescription}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
