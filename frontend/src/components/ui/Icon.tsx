import { IconSvg } from "./IconSvg";
import { ICONS, type IconName } from "./icons.generated";

type IconProps = {
  name: IconName;
  className?: string;
  /** Accessible name. Omit for decorative icons next to visible text (the default). */
  label?: string;
};

/**
 * Inline SVG icon from the generated Bootstrap Icons subset. For Server Components: it imports every
 * icon, which is free on the server but would add ~18 KB to the browser bundle. Client Components
 * use ClientIcon instead.
 */
export function Icon({ name, className, label }: IconProps) {
  return <IconSvg markup={ICONS[name]} className={className} label={label} />;
}

/**
 * API content names icons with plain strings (e.g. "trophy"). We only ship a subset of
 * Bootstrap Icons, so unknown or missing names get the fallback instead of breaking the page.
 */
export function toIconName(name: string | undefined, fallback: IconName): IconName {
  return name !== undefined && Object.hasOwn(ICONS, name) ? (name as IconName) : fallback;
}

export type { IconName };
