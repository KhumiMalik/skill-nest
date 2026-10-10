import { ContentLink } from "@/components/ui/ContentLink";
import type { Cta } from "../types";

/** The green call-to-action band. */
export function CtaBand({ cta, className }: { cta: Cta; className?: string }) {
  return (
    <div className={className ? `cta-band ${className}` : "cta-band"}>
      <h2 className="h3">{cta.title}</h2>
      <p>{cta.text}</p>
      <ContentLink href={cta.link.href} className="btn-light-main">
        {cta.link.label}
      </ContentLink>
    </div>
  );
}
