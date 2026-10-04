import { ICONS, type IconName } from "./icons.generated";

type IconProps = {
  name: IconName;
  className?: string;
  /** Accessible name. Omit for decorative icons next to visible text (the default). */
  label?: string;
};

/** Inline SVG icon from the generated Bootstrap Icons subset. */
export function Icon({ name, className, label }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className ? `icon ${className}` : "icon"}
      focusable="false"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      // The markup comes from a generated, trusted file, never from user input.
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

/**
 * API content names icons with plain strings (e.g. "trophy"). We only ship a subset of
 * Bootstrap Icons, so unknown or missing names get the fallback instead of breaking the page.
 */
export function toIconName(name: string | undefined, fallback: IconName): IconName {
  return name !== undefined && Object.hasOwn(ICONS, name) ? (name as IconName) : fallback;
}

export type { IconName };
