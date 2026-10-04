"use client";

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

export type TabItem = { id: string; label: string; panel: ReactNode };

type TabsProps = {
  /** Accessible name of the tab list, e.g. "Programs by stage". */
  label: string;
  tabs: TabItem[];
};

/**
 * Tabs following the WAI-ARIA tabs pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):
 * - one tab stop for the whole tab list; Left/Right arrows, Home and End move between tabs;
 * - selection follows focus ("automatic activation"), since every panel is already rendered;
 * - panels are rendered on the server and passed in as `panel`, so their content is in the HTML.
 */
export function Tabs({ label, tabs }: TabsProps) {
  const baseId = useId();
  const [selectedId, setSelectedId] = useState(tabs[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const tab = tabs[index];
    if (!tab) return;
    setSelectedId(tab.id);
    tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  }

  return (
    <>
      <div role="tablist" aria-label={label} className="nav pill-tabs">
        {tabs.map((tab, index) => {
          const selected = tab.id === selectedId;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={selected ? "nav-link active" : "nav-link"}
              onClick={() => setSelectedId(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          tabIndex={0}
          hidden={tab.id !== selectedId}
        >
          {tab.panel}
        </div>
      ))}
    </>
  );
}
