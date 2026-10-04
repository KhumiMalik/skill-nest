type SectionTitleProps = {
  title: string;
  subtitle?: string;
  /** Heading level. Sections on a page are h2 by default. */
  as?: "h2" | "h3";
  id?: string;
  /** Extra classes for spacing, e.g. "mt-5 pt-4 pb-4". */
  className?: string;
};

export function SectionTitle({ title, subtitle, as: Heading = "h2", id, className }: SectionTitleProps) {
  return (
    <div className={className ? `section-title reveal ${className}` : "section-title reveal"}>
      <Heading id={id}>{title}</Heading>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
