"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export type NavigationBarItem = Readonly<{
  href: string;
  label: string;
  trailingContent?: ReactNode;
}>;

export type NavigationBarProps = Readonly<{
  actions: ReactNode;
  brand: ReactNode;
  items: readonly NavigationBarItem[];
  label: string;
}>;

export function NavigationBar({
  actions,
  brand,
  items,
  label,
}: NavigationBarProps) {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const updateFloatingState = () => setIsFloating(window.scrollY > 8);

    updateFloatingState();
    window.addEventListener("scroll", updateFloatingState, { passive: true });

    return () => window.removeEventListener("scroll", updateFloatingState);
  }, []);

  return (
    <div className="shrink-0 min-h-[calc(var(--rt-control-height-lg)+var(--rt-space-4))]">
      <div
        className={isFloating
          ? "fixed inset-x-0 top-(--rt-space-4) z-50 px-(--rt-page-gutter)"
          : undefined}
      >
        <header
          className={isFloating
            ? "mx-auto max-w-(--rt-container-max) rounded-panel border border-line-subtle bg-surface shadow-md"
            : "border-b border-line-subtle bg-surface"}
        >
          <div className="mx-auto grid min-h-[calc(var(--rt-control-height-lg)+var(--rt-space-4))] max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-(--rt-space-6) px-(--rt-page-gutter)">
            <div className="justify-self-start">{brand}</div>

            <nav
              aria-label={label}
              className="hidden items-center gap-(--rt-space-8) text-sm font-medium text-ink md:flex"
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-(--rt-space-1) rounded-md transition-colors duration-(--rt-duration-fast) hover:text-brand"
                >
                  {item.label}
                  {item.trailingContent}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-self-end gap-(--rt-space-3)">
              {actions}
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
