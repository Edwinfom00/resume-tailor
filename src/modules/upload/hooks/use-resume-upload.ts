"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { toLocalizedErrorMessage } from "@/modules/session/state/use-domain-error-message";
import {
  toUploadedResumeView,
  type UploadedResumeView,
} from "@/modules/upload/view-models/uploaded-resume";

export type ResumeUploadStage = "idle" | "validating" | "parsing" | "ready" | "error";

const stageByParseStatus = {
  idle: "idle",
  validating: "validating",
  extracting: "parsing",
  structuring: "parsing",
  "validating-result": "parsing",
  completed: "ready",
  failed: "error",
} as const satisfies Record<string, ResumeUploadStage>;

type UseResumeUploadOptions = Readonly<{
  domainErrorMessages: Messages["domainErrors"];
  locale: Locale;
  messages: Messages["upload"];
}>;

export function useResumeUpload({
  domainErrorMessages,
  locale,
  messages,
}: UseResumeUploadOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFileRef = useRef<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isHydrated = useSessionHydrated();
  const status = useSessionStore((state) => state.resume.status);
  const originalFile = useSessionStore((state) => state.resume.originalFile);
  const hasResume = useSessionStore((state) => Boolean(state.resume.data));
  const warnings = useSessionStore((state) => state.resume.warnings);
  const error = useSessionStore((state) => state.resume.error);
  const uploadResume = useSessionStore((state) => state.uploadResume);
  const clearResume = useSessionStore((state) => state.clearResume);

  const stage: ResumeUploadStage = isHydrated ? stageByParseStatus[status] : "idle";
  const isParsing = stage === "parsing" || stage === "validating";

  const uploadedFile: UploadedResumeView | null = useMemo(
    () =>
      isHydrated && originalFile
        ? toUploadedResumeView(originalFile, locale, messages)
        : null,
    [isHydrated, locale, messages, originalFile],
  );

  const submitFile = useCallback(
    (file: File) => {
      lastFileRef.current = file;
      void uploadResume(file);
    },
    [uploadResume],
  );

  const chooseFile = useCallback(() => {
    if (!isParsing) {
      inputRef.current?.click();
    }
  }, [isParsing]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const [file] = Array.from(event.target.files ?? []);

      event.target.value = "";

      if (file) {
        submitFile(file);
      }
    },
    [submitFile],
  );

  const handleDropzoneKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        chooseFile();
      }
    },
    [chooseFile],
  );

  const dropzoneHandlers = useMemo(
    () => ({
      onDragEnter: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (!isParsing) {
          setIsDragging(true);
        }
      },
      onDragOver: (event: DragEvent<HTMLDivElement>) => event.preventDefault(),
      onDragLeave: () => setIsDragging(false),
      onDrop: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        if (isParsing) {
          return;
        }

        const [file] = Array.from(event.dataTransfer.files);

        if (file) {
          submitFile(file);
        }
      },
    }),
    [isParsing, submitFile],
  );

  const retry = useCallback(() => {
    const file = lastFileRef.current;

    if (file) {
      submitFile(file);

      return;
    }

    chooseFile();
  }, [chooseFile, submitFile]);

  const warningMessages = useMemo(
    () =>
      isHydrated
        ? warnings.map((code) => messages.warnings[code]).filter(Boolean)
        : [],
    [isHydrated, messages.warnings, warnings],
  );

  return {
    chooseFile,
    dropzoneHandlers,
    errorMessage: isHydrated
      ? toLocalizedErrorMessage(error, domainErrorMessages)
      : null,
    handleDropzoneKeyDown,
    handleFileChange,
    hasResume: isHydrated && hasResume,
    inputRef,
    isDragging,
    isParsing,
    removeFile: clearResume,
    retry,
    stage,
    uploadedFile,
    warningMessages,
  };
}
