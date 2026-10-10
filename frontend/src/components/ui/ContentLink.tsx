import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

type ContentLinkProps = { href: string; className?: string; children: ReactNode };

/**
 * A link whose target comes from the API (already validated by `linkHrefSchema`): site paths use
 * next/link for client-side navigation, URLs and `mailto:` links are plain anchors.
 */
export function ContentLink({ href, className, children }: ContentLinkProps) {
  if (href.startsWith("/")) {
    return (
      // Validated by linkHrefSchema. Typed routes can only check paths written in the code, not data.
      <Link href={href as Route} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
