import type { Route } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "../seo/JsonLd";

export type Breadcrumb = { label: string; href?: Route };

type PageBannerProps = {
  title: string;
  description?: string;
  /** Trail after "Home". The last item is the current page and is not linked. */
  breadcrumbs?: Breadcrumb[];
};

/** Dark title band at the top of every inner page, with breadcrumbs (also as BreadcrumbList structured data). */
export function PageBanner({ title, description, breadcrumbs = [{ label: title }] }: PageBannerProps) {
  const trail: Breadcrumb[] = [{ label: "Home", href: "/" }, ...breadcrumbs];

  return (
    <div className="page-title">
      <div className="container">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {trail.map((crumb, index) => {
              const isCurrent = index === trail.length - 1;
              return (
                <li key={`${crumb.label}-${index}`}>
                  {crumb.href && !isCurrent ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current={isCurrent ? "page" : undefined}>{crumb.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <JsonLd data={breadcrumbJsonLd(trail)} />
      </div>
    </div>
  );
}
