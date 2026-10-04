"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      className={`scroll-top border-0${visible ? " show" : ""}`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
    >
      <Icon name="arrow-up-short" />
    </button>
  );
}
