import { generateResumeExportFileName } from "./export-filename";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const RESUME_PAGE_SELECTOR = "[data-resume-page]";
const MEASUREMENT_COPY_SELECTOR = "[aria-hidden='true']";

export type ResumePdfExportResult = Readonly<{
  linkCount: number;
  pageCount: number;
}>;

type PdfLinkTarget = Readonly<{
  height: number;
  url: string;
  width: number;
  x: number;
  y: number;
}>;

function waitForAnimationFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

// The paginated document also renders an off-screen measurement copy holding
// every block on a single page. It must never be captured.
function getExportablePages() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(RESUME_PAGE_SELECTOR),
  ).filter((page) => !page.closest(MEASUREMENT_COPY_SELECTOR));
}

interface CapturedStyles {
  readonly display: string;
  readonly transform: string;
}

// Two things about the on-screen preview break a faithful capture:
// it hides every page except the one being viewed, and it applies a zoom
// transform on an ancestor. Under a scaled ancestor html2canvas positions text
// runs with the scaled geometry but paints glyphs at their unscaled size, so
// every word creeps left and swallows the space before it. Both are undone for
// the duration of the capture and restored afterwards.
function createCaptureScope() {
  const previousStyles = new Map<HTMLElement, CapturedStyles>();

  const remember = (element: HTMLElement) => {
    if (!previousStyles.has(element)) {
      previousStyles.set(element, {
        display: element.style.display,
        transform: element.style.transform,
      });
    }
  };

  return {
    prepare(pages: readonly HTMLElement[]) {
      pages.forEach((page) => {
        remember(page);
        page.style.display = "";

        for (
          let ancestor = page.parentElement;
          ancestor !== null && ancestor !== document.body;
          ancestor = ancestor.parentElement
        ) {
          if (window.getComputedStyle(ancestor).transform !== "none") {
            remember(ancestor);
            ancestor.style.transform = "none";
          }
        }
      });
    },
    restore() {
      previousStyles.forEach((styles, element) => {
        element.style.display = styles.display;
        element.style.transform = styles.transform;
      });
      previousStyles.clear();
    },
  };
}

async function getResumePages() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const pages = getExportablePages();

    if (pages.length) {
      return pages;
    }

    await waitForAnimationFrame();
  }

  throw new Error("No resume pages are available for export.");
}

async function waitForImage(image: HTMLImageElement) {
  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener(
        "error",
        () => reject(new Error(`Unable to load image: ${image.currentSrc || image.src}`)),
        { once: true },
      );
    });
  }

  await image.decode().catch(() => undefined);
}

async function waitForResumeResources(pages: readonly HTMLElement[]) {
  await document.fonts.ready;
  await Promise.all(
    pages.flatMap((page) =>
      Array.from(page.querySelectorAll<HTMLImageElement>("img")).map(waitForImage),
    ),
  );
  await waitForAnimationFrame();
  await waitForAnimationFrame();
}

function haveSamePages(
  first: readonly HTMLElement[],
  second: readonly HTMLElement[],
) {
  return (
    first.length === second.length &&
    first.every((page, index) => page === second[index])
  );
}

async function getSettledResumePages() {
  const initialPages = await getResumePages();

  await waitForResumeResources(initialPages);

  const settledPages = await getResumePages();

  if (haveSamePages(initialPages, settledPages)) {
    return settledPages;
  }

  await waitForResumeResources(settledPages);

  return getResumePages();
}

function getLinkTargets(
  page: HTMLElement,
  anchor: HTMLAnchorElement,
): readonly PdfLinkTarget[] {
  const href = anchor.href;

  if (!href || href.startsWith("javascript:")) {
    return [];
  }

  const pageBounds = page.getBoundingClientRect();

  return Array.from(anchor.getClientRects()).flatMap((anchorBounds) => {
    const left = Math.max(anchorBounds.left, pageBounds.left);
    const top = Math.max(anchorBounds.top, pageBounds.top);
    const right = Math.min(anchorBounds.right, pageBounds.right);
    const bottom = Math.min(anchorBounds.bottom, pageBounds.bottom);

    if (right <= left || bottom <= top) {
      return [];
    }

    return [
      {
        url: href,
        x: ((left - pageBounds.left) / pageBounds.width) * A4_WIDTH_MM,
        y: ((top - pageBounds.top) / pageBounds.height) * A4_HEIGHT_MM,
        width: ((right - left) / pageBounds.width) * A4_WIDTH_MM,
        height: ((bottom - top) / pageBounds.height) * A4_HEIGHT_MM,
      },
    ];
  });
}

function downloadPdf(blob: Blob, fileName: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
}

function applyCanvasTextSpacingCompensation(documentClone: Document) {
  const style = documentClone.createElement("style");

  style.textContent = `
    [data-resume-page] header > h1 {
      margin-bottom: var(--rt-space-2) !important;
    }

    [data-resume-page] header > address {
      margin-bottom: calc(var(--rt-space-2) * -1) !important;
    }

    [data-resume-page] h2 {
      padding-bottom: var(--rt-space-3) !important;
    }

    [data-resume-page] h2 + * {
      margin-top: var(--rt-space-1) !important;
    }

    [data-resume-page] [data-resume-highlight],
    [data-resume-page] [data-resume-selected] {
      animation: none !important;
      background-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
  `;

  documentClone.head.append(style);
}

export async function exportResumePdf(
  fileName = generateResumeExportFileName(),
): Promise<ResumePdfExportResult> {
  const capture = createCaptureScope();

  try {
    capture.prepare(await getResumePages());

    const pages = await getSettledResumePages();

    capture.prepare(pages);

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const pdf = new jsPDF({
      compress: true,
      format: "a4",
      orientation: "portrait",
      unit: "mm",
    });
    const captureScale = Math.min(3, Math.max(2, window.devicePixelRatio));
    let linkCount = 0;

    for (const [pageIndex, page] of pages.entries()) {
      if (pageIndex > 0) {
        pdf.addPage("a4", "portrait");
      }

      const canvas = await html2canvas(page, {
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        onclone: applyCanvasTextSpacingCompensation,
        scale: captureScale,
        useCORS: true,
      });

      pdf.addImage(canvas, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

      page.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
        getLinkTargets(page, anchor).forEach((target) => {
          pdf.link(target.x, target.y, target.width, target.height, {
            url: target.url,
          });
          linkCount += 1;
        });
      });
    }

    downloadPdf(pdf.output("blob"), fileName);

    return {
      linkCount,
      pageCount: pages.length,
    };
  } finally {
    capture.restore();
  }
}
