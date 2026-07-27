"use client";

import { useEffect, useState } from "react";

const ROLL_MS = 1300;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Counts up from (value - 1000) to the real value once on mount, rather
// than starting at 0 or spinning indefinitely — a bounded, honest roll
// that always lands on and stays at the true fetched count. The
// intermediate numbers during that ~1.3s sweep are what give it the
// "rolling" feel; the number itself is never fabricated or left
// unsettled. `startDelayMs` staggers each card's card so all 4 don't
// roll in lockstep. See design.md `live-trial-stats`.
export default function RollingNumber({
  value,
  startDelayMs = 0,
  className = "",
}: {
  value: number;
  startDelayMs?: number;
  className?: string;
}) {
  const startValue = Math.max(0, value - 1000);
  const [displayed, setDisplayed] = useState(startValue);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayed(value);
      return;
    }
    let frame: number;
    let startTimer: ReturnType<typeof setTimeout>;
    startTimer = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min((now - start) / ROLL_MS, 1);
        setDisplayed(Math.round(startValue + (value - startValue) * easeOutCubic(progress)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }, startDelayMs);
    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(frame);
    };
  }, [value, startValue, startDelayMs]);

  return (
    <span className={`tabular-nums ${className}`} aria-label={value.toLocaleString()}>
      {displayed.toLocaleString()}
    </span>
  );
}
