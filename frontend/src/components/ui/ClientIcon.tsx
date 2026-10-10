import { IconSvg } from "./IconSvg";
import { CLIENT_ICONS, type ClientIconName } from "./icons.client.generated";

type ClientIconProps = {
  name: ClientIconName;
  className?: string;
  /** Accessible name. Omit for decorative icons next to visible text (the default). */
  label?: string;
};

/**
 * Icon for Client Components. It only knows the few icons listed in CLIENT_ICONS
 * (scripts/generate-icons.mjs), so the browser bundle doesn't carry the whole icon set.
 * To use another icon here, add it to CLIENT_ICONS and run `npm run icons`.
 */
export function ClientIcon({ name, className, label }: ClientIconProps) {
  return <IconSvg markup={CLIENT_ICONS[name]} className={className} label={label} />;
}
