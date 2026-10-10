import { siteConfig } from "@/config/site";
import { Icon, type IconName } from "./Icon";

type ShareLinksProps = {
  /** Site path of the page to share, e.g. "/news/open-day". */
  path: string;
  title: string;
};

/**
 * Plain share links (no third-party scripts or tracking): each opens the network's own share page.
 * They don't need JavaScript, and our CSP doesn't have to allow any external scripts.
 */
export function ShareLinks({ path, title }: ShareLinksProps) {
  const url = new URL(path, siteConfig.url).toString();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links: { label: string; icon: IconName; href: string }[] = [
    { label: "X", icon: "twitter-x", href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "Facebook", icon: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "LinkedIn", icon: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "email", icon: "envelope", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <ul className="social-links list-unstyled justify-content-start mb-0">
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} {...(link.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
            <Icon name={link.icon} label={`Share on ${link.label}`} />
          </a>
        </li>
      ))}
    </ul>
  );
}
