"use client";

import { useEffect } from "react";

/**
 * Fades in elements with the `.reveal` class as they scroll into view.
 * Content is visible without JavaScript: the hidden starting state only applies once
 * this component marks <html> with `js-reveal` (see styles/_motion.scss), and users who
 * prefer reduced motion never get the animation.
 *
 * Elements added later (streamed Suspense content, a new page after client-side
 * navigation, a filtered list) are picked up by a MutationObserver, so they never stay hidden.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      return;
    }
    root.classList.add("js-reveal");

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            intersection.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    const observeNew = (scope: ParentNode) => {
      scope.querySelectorAll(".reveal:not(.visible)").forEach((el) => intersection.observe(el));
    };

    observeNew(document);
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(".reveal:not(.visible)")) intersection.observe(node);
          observeNew(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      intersection.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
