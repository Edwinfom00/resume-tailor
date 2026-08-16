"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { ResumePage } from "./resume-page";

export type ResumeDocumentBlock<TData> = Readonly<{
  id: string;
  render: (data: TData) => ReactNode;
}>;

export type ResumeDocumentProps<TData> = Readonly<{
  data: TData;
  blocks: readonly ResumeDocumentBlock<TData>[];
}>;

type ResumePageBlocksProps<TData> = Readonly<{
  blocks: readonly ResumeDocumentBlock<TData>[];
  data: TData;
  measurementRef?: RefObject<HTMLDivElement | null>;
}>;

function hasSamePagination(
  current: readonly (readonly string[])[] | null,
  next: readonly (readonly string[])[],
) {
  return (
    current?.length === next.length &&
    current.every(
      (page, pageIndex) =>
        page.length === next[pageIndex]?.length &&
        page.every(
          (blockId, blockIndex) => blockId === next[pageIndex]?.[blockIndex],
        ),
    )
  );
}

function paginateBlockIds(
  blockIds: readonly string[],
  heights: readonly number[],
  availableHeight: number,
  gap: number,
) {
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentHeight = 0;

  blockIds.forEach((blockId, index) => {
    const blockHeight = heights[index] ?? 0;
    const nextHeight = currentHeight + (currentPage.length ? gap : 0) + blockHeight;

    if (currentPage.length && nextHeight > availableHeight) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }

    currentHeight += (currentPage.length ? gap : 0) + blockHeight;
    currentPage.push(blockId);
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  return pages;
}

function ResumePageBlocks<TData>({
  blocks,
  data,
  measurementRef,
}: ResumePageBlocksProps<TData>) {
  return (
    <div
      ref={measurementRef}
      className="box-border flex h-full flex-col gap-(--rt-resume-section-gap) px-(--rt-resume-page-inset-inline) pt-(--rt-resume-page-inset-block-start) pb-(--rt-resume-page-inset-block-end)"
    >
      {blocks.map((block) => (
        <div key={block.id} className="shrink-0">
          {block.render(data)}
        </div>
      ))}
    </div>
  );
}

export function ResumeDocument<TData>({
  data,
  blocks,
}: ResumeDocumentProps<TData>) {
  const measurementRef = useRef<HTMLDivElement>(null);
  const [pageBlockIds, setPageBlockIds] = useState<readonly (readonly string[])[] | null>(
    null,
  );

  useLayoutEffect(() => {
    const measurementElement = measurementRef.current;

    if (!measurementElement) {
      return;
    }

    const measure = () => {
      const pageElement = measurementElement.parentElement;

      if (!pageElement) {
        return;
      }

      const styles = window.getComputedStyle(measurementElement);
      const availableHeight =
        pageElement.getBoundingClientRect().height -
        Number.parseFloat(styles.paddingTop) -
        Number.parseFloat(styles.paddingBottom);
      const gap = Number.parseFloat(styles.rowGap);
      const blockHeights = Array.from(measurementElement.children, (element) =>
        element.getBoundingClientRect().height,
      );
      const nextPageBlockIds = paginateBlockIds(
        blocks.map((block) => block.id),
        blockHeights,
        availableHeight,
        gap,
      );

      setPageBlockIds((current) =>
        hasSamePagination(current, nextPageBlockIds) ? current : nextPageBlockIds,
      );
    };

    const frameId = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);

    observer.observe(measurementElement);
    Array.from(measurementElement.children).forEach((element) => {
      observer.observe(element);
    });
    void document.fonts?.ready.then(measure);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [blocks, data]);

  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  const paginatedBlocks = pageBlockIds?.map((page) =>
    page
      .map((blockId) => blocksById.get(blockId))
      .filter(
        (block): block is ResumeDocumentBlock<TData> => Boolean(block),
      ),
  );

  return (
    <section className="flex min-h-full w-full flex-col items-center gap-6 overflow-auto p-(--rt-page-gutter)">
      {paginatedBlocks?.map((pageBlocks, pageIndex) => (
        <ResumePage
          key={`${pageIndex}-${pageBlocks.map((block) => block.id).join("-")}`}
        >
          <ResumePageBlocks blocks={pageBlocks} data={data} />
        </ResumePage>
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 invisible"
      >
        <ResumePage>
          <ResumePageBlocks
            blocks={blocks}
            data={data}
            measurementRef={measurementRef}
          />
        </ResumePage>
      </div>
    </section>
  );
}
