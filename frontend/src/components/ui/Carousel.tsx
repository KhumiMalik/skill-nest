"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ApiImage } from "@/lib/api/schemas";
import { ClientIcon } from "./ClientIcon";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

type CarouselProps = {
  images: ApiImage[];
  /** Accessible name, e.g. "Academic facilities photos". */
  label: string;
  /** next/image `sizes` of the slides. */
  sizes: string;
  intervalMs?: number;
};

/**
 * Image slideshow following the WAI-ARIA carousel pattern (https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).
 * It advances on its own only while all of these hold:
 * - the visitor hasn't paused it (the pause button is required by WCAG 2.2.2 for moving content);
 * - they don't prefer reduced motion (then it starts paused, but they can still press Play);
 * - the pointer or keyboard focus isn't on it, so people can read and use the controls;
 * - it is on screen (no rotating in hidden tabs or far down the page).
 */
export function Carousel({ images, label, sizes, intervalMs = 6000 }: CarouselProps) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<"play" | "pause" | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  // On the server (and during hydration) we assume reduced motion, so nothing moves before we know.
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );

  const count = images.length;
  const autoplay = userChoice === null ? !reduceMotion : userChoice === "play";
  const rotating = autoplay && !hovered && !focused && visible && count > 1;

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), intervalMs);
    return () => window.clearInterval(timer);
  }, [rotating, count, intervalMs]);

  if (count === 0) return null;

  return (
    <section
      ref={ref}
      className="carousel"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        // Only when focus leaves the carousel, not when it moves between its buttons.
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      {/* Polite announcements only when the visitor changes the slide, not on every automatic change. */}
      <div className="carousel-slides" aria-live={rotating ? "off" : "polite"}>
        {images.map((image, slideIndex) => (
          <div
            key={image.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${count}`}
            className="carousel-slide"
            hidden={slideIndex !== index}
          >
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} />
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-btn carousel-toggle"
            onClick={() => setUserChoice(autoplay ? "pause" : "play")}
          >
            <ClientIcon
              name={autoplay ? "pause-fill" : "play-fill"}
              label={autoplay ? "Stop automatic slide show" : "Start automatic slide show"}
            />
          </button>
          <button
            type="button"
            className="carousel-btn"
            onClick={() => setIndex((current) => (current - 1 + count) % count)}
          >
            <ClientIcon name="chevron-left" label="Previous slide" />
          </button>
          <button type="button" className="carousel-btn" onClick={() => setIndex((current) => (current + 1) % count)}>
            <ClientIcon name="chevron-right" label="Next slide" />
          </button>
        </div>
      )}
    </section>
  );
}
