const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const RESUME_PAGE_SELECTOR = "[data-resume-page]";

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

function isVisible(element: HTMLElement) {
  const styles = window.getComputedStyle(element);

  return styles.display !== "none" && styles.visibility !== "hidden";
}

async function getResumePages() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const pages = Array.from(
      document.querySelectorAll<HTMLElement>(RESUME_PAGE_SELECTOR),
    ).filter(isVisible);

    if (pages.length) {
      return pages;
    }

    await waitForAnimationFrame();
  }

  throw new Error("No visible resume pages are available for export.");
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
  `;

  documentClone.head.append(style);
}

export async function exportResumePdf(
  fileName = "resume.pdf",
): Promise<ResumePdfExportResult> {
  const pages = await getSettledResumePages();

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
}
