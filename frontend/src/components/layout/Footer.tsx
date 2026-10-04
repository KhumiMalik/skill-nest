import { cacheLife } from "next/cache";
import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

/**
 * The year comes from a cached component: reading the clock during prerender is not
 * allowed with Cache Components, and caching it for a day keeps the footer static.
 */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-12">
            <Link href="/" className="logo">
              <span>{siteConfig.name}</span>
            </Link>
            <address>
              {contact.addressLines.map((line) => (
                <span key={line} className="d-block">
                  {line}
                </span>
              ))}
            </address>
            <p className="contact-line mb-1">
              <strong>Phone:</strong> <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            </p>
            <p className="contact-line mb-0">
              <strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <ul className="social-links list-unstyled">
              {siteConfig.social.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <Icon name={social.icon} label={`${siteConfig.name} on ${social.label}`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerNav.map((column) => (
            <nav className="col-lg-2 col-6" key={column.title} aria-label={column.title}>
              <h2 className="h4">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          &copy; <CopyrightYear /> {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
