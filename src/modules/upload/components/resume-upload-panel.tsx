"use client";

import {
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiEdit2,
  FiLoader,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { useResumeUpload } from "@/modules/upload/hooks/use-resume-upload";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

type ResumeUploadPanelProps = Readonly<{
  domainErrorMessages: Messages["domainErrors"];
  locale: Locale;
  messages: Messages["upload"];
}>;

export function ResumeUploadPanel({
  domainErrorMessages,
  locale,
  messages,
}: ResumeUploadPanelProps) {
  const {
    chooseFile,
    dropzoneHandlers,
    errorMessage,
    handleDropzoneKeyDown,
    handleFileChange,
    inputRef,
    isDragging,
    isParsing,
    removeFile,
    retry,
    stage,
    uploadedFile,
    warningMessages,
  } = useResumeUpload({ domainErrorMessages, locale, messages });

  return (
    <div className="w-full">
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
          disabled={isParsing}
          onChange={handleFileChange}
        />

        <div
          role="button"
          tabIndex={0}
          aria-busy={isParsing}
          aria-disabled={isParsing}
          aria-label={messages.chooseFileLabel}
          onClick={chooseFile}
          onKeyDown={handleDropzoneKeyDown}
          {...dropzoneHandlers}
          className={`mt-(--rt-space-6) flex min-h-(--rt-upload-dropzone-min-height) flex-col items-center justify-center rounded-lg border border-dashed px-(--rt-space-6) text-center transition-colors duration-(--rt-duration-fast) ${
            isParsing
              ? "cursor-progress border-brand bg-surface-brand"
              : isDragging
                ? "cursor-pointer border-brand bg-surface-brand"
                : "cursor-pointer border-brand-line bg-surface"
          }`}
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-brand text-brand ${
              isParsing ? "rt-animate-breathe" : ""
            }`}
          >
            {isParsing ? (
              <FiLoader aria-hidden="true" className="h-8 w-8 animate-spin" />
            ) : (
              <FiUpload aria-hidden="true" className="h-8 w-8" />
            )}
          </span>

          {isParsing ? (
            <>
              <p className="mt-(--rt-space-5) text-base font-bold text-ink">
                {stage === "validating"
                  ? messages.validatingLabel
                  : messages.parsingLabel}
              </p>
              <p className="mt-(--rt-space-2) max-w-xs text-xs text-ink-muted">
                {messages.parsingHint}
              </p>
              <span
                aria-hidden="true"
                className="rt-sweep mt-(--rt-space-5) h-1 w-40 rounded-pill bg-brand-subtle"
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="rt-animate-rise mt-(--rt-space-3) flex flex-wrap items-center gap-(--rt-space-3)"
          >
            <p className="min-w-0 flex-1 text-sm text-negative">{errorMessage}</p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-3) text-xs font-semibold text-ink transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
            >
              <FiRefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
              {messages.retryLabel}
            </button>
          </div>
        ) : null}

        <div className="mt-(--rt-space-5)">
          <p className="text-xs font-bold text-ink">{messages.uploadedFileLabel}</p>
          {uploadedFile ? (
            <div
              key={uploadedFile.name}
              className="rt-animate-rise mt-(--rt-space-2) flex min-h-(--rt-upload-file-row-min-height) items-center gap-(--rt-space-3) rounded-lg border border-line-subtle px-(--rt-space-3) shadow-xs"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-negative-subtle text-negative">
                <FiFileText aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {uploadedFile.name}
                </p>
                <p className="flex items-center gap-(--rt-space-2) text-xs text-ink-muted">
                  {uploadedFile.metadata}
                  {stage === "ready" ? (
                    <span className="inline-flex items-center gap-1 text-positive">
                      <FiCheckCircle aria-hidden="true" className="h-3 w-3" />
                      {messages.parsedLabel}
                    </span>
                  ) : null}
                </p>
              </div>
              <span className="hidden rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-xs font-medium text-positive sm:inline">
                {uploadedFile.format}
              </span>
              <button
                type="button"
                disabled={isParsing}
                onClick={chooseFile}
                className="inline-flex items-center gap-1 rounded-md p-1 text-xs font-semibold text-brand transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiEdit2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{messages.changeFileLabel}</span>
              </button>
              <button
                type="button"
                disabled={isParsing}
                onClick={removeFile}
                className="inline-flex items-center gap-1 rounded-md p-1 text-xs font-semibold text-negative transition-colors duration-(--rt-duration-fast) hover:bg-negative-subtle disabled:cursor-not-allowed disabled:opacity-50"
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

        {warningMessages.length > 0 ? (
          <div className="rt-animate-rise mt-(--rt-space-3) rounded-lg border border-line-subtle bg-caution-subtle p-(--rt-space-3)">
            <p className="flex items-center gap-(--rt-space-2) text-xs font-semibold text-caution">
              <FiAlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
              {messages.warningsLabel}
            </p>
            <ul className="mt-(--rt-space-2) space-y-1 text-xs text-ink-muted">
              {warningMessages.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-(--rt-space-5) flex items-center gap-(--rt-space-2) text-xs text-ink-muted">
          <FiShield aria-hidden="true" className="h-4 w-4 shrink-0" />
          <p>{messages.privacyLabel}</p>
        </div>
      </div>
    </div>
  );
}
