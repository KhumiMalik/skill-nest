"use client";

import { useEffect } from "react";

/** Whether the element's top is above the bottom of the viewport (on screen, or already scrolled past). */
function isOnScreen(element: Element): boolean {
  return element.getBoundingClientRect().top < window.innerHeight;
}

/**
 * Fades in elements with the `.reveal` class as they scroll into view.
 * Content is visible without JavaScript: the hidden starting state only applies once
 * this component marks <html> with `js-reveal` (see styles/_motion.scss), and users who
 * prefer reduced motion never get the animation.
 *
 * Elements that are already on screen when this runs are shown straight away. Hiding them to
 * fade them back in would make them flicker, and would delay the page's Largest Contentful Paint
 * until JavaScript has loaded (a big cost on slow phones).
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
    const track = (elements: Element[]) => {
      // Measure every element first, then change classes. Alternating reads and writes would make
      // the browser recalculate the page layout once per element ("layout thrashing").
      const onScreen = elements.map(isOnScreen);
      elements.forEach((element, index) => {
        if (onScreen[index]) element.classList.add("visible");
        else intersection.observe(element);
      });
    };
    const trackAll = (scope: ParentNode) => track([...scope.querySelectorAll(".reveal:not(.visible)")]);

    // Mark what is on screen before enabling the hidden state, so it never disappears.
    trackAll(document);
    root.classList.add("js-reveal");

    const mutations = new MutationObserver((records) => {
      const added: Element[] = [];
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(".reveal:not(.visible)")) added.push(node);
          added.push(...node.querySelectorAll(".reveal:not(.visible)"));
        }
      }
      if (added.length > 0) track(added);
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
