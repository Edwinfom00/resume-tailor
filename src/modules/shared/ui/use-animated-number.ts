"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/modules/shared/ui/use-reduced-motion";

const defaultDuration = 720;

function easeOut(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function useAnimatedNumber(
  target: number | undefined,
  duration = defaultDuration,
) {
  const prefersReducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(target);
  const displayedRef = useRef(target);

  useEffect(() => {
    let frameId = 0;
    const commit = (value: number | undefined) => {
      displayedRef.current = value;
      setDisplayed(value);
    };
    const from = displayedRef.current;

    if (
      target === undefined ||
      from === undefined ||
      from === target ||
      prefersReducedMotion
    ) {
      frameId = window.requestAnimationFrame(() => commit(target));

      return () => window.cancelAnimationFrame(frameId);
    }

    const start = performance.now();
    const step = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - start) / duration);

      commit(Math.round(from + (target - from) * easeOut(progress)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [duration, prefersReducedMotion, target]);

  return displayed;
}
