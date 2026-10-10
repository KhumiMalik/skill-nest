type IconSvgProps = {
  /** Inner SVG markup from a generated icon file (trusted, never user input). */
  markup: string;
  className?: string;
  /** Accessible name. Omit for decorative icons next to visible text (the default). */
  label?: string;
};

/** The <svg> element shared by Icon (Server Components) and ClientIcon (Client Components). */
export function IconSvg({ markup, className, label }: IconSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className ? `icon ${className}` : "icon"}
      focusable="false"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      // The markup comes from a generated, trusted file, never from user input.
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
