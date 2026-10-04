"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1600;

function format(value: number) {
  // A fixed locale keeps server and browser output identical (no hydration mismatch).
  return value.toLocaleString("en-GB");
}

type CounterProps = { value: number; prefix?: string; suffix?: string };

/**
 * A number that counts up from zero when it scrolls into view (the template's `.counter`).
 * - The server renders the final value, so it is correct without JavaScript and for search engines.
 * - Screen readers only get the final value; the animated digits are aria-hidden.
 * - No animation for users who prefer reduced motion.
 */
export function Counter({ value, prefix = "", suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduceMotion || !("IntersectionObserver" in window)) return;

    let frame = 0;
    // Same threshold as RevealOnScroll, so counting starts while the section fades in.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          setDisplay(Math.floor(value * progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      <span className="visually-hidden">{`${prefix}${format(value)}${suffix}`}</span>
      <span aria-hidden="true">{`${prefix}${format(display)}${suffix}`}</span>
    </span>
  );
}
