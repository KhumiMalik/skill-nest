import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatDate, isoDateTime } from "@/lib/dates";
import { NEWS_CATEGORY_LABELS } from "../schemas";
import type { NewsSummary } from "../types";

/** News card used in the /news grid (image with category badge, date, author, excerpt). */
export function NewsMediaCard({ article, lead = false }: { article: NewsSummary; lead?: boolean }) {
  return (
    <article className={lead ? "media-card lead-story" : "media-card"}>
      <div className="media-img">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          width={article.image.width}
          height={article.image.height}
          sizes={lead ? "(max-width: 991px) 100vw, 60vw" : "(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"}
          preload={lead}
        />
        <span className="badge-tag">{NEWS_CATEGORY_LABELS[article.category]}</span>
      </div>
      <div className="media-body">
        <ul className="meta-list list-unstyled">
          <li>
            <Icon name="calendar3" />
            <time dateTime={isoDateTime(article.publishedAt)}>{formatDate(article.publishedAt)}</time>
          </li>
          <li>
            <Icon name="person" />
            {article.author.name}
          </li>
        </ul>
        <h3>
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mb-0">{article.excerpt}</p>
      </div>
    </article>
  );
}

/** Compact horizontal card (top stories sidebar column). */
export function NewsRowCard({ article }: { article: NewsSummary }) {
  return (
    <article className="media-card media-card-row">
      <div className="media-row-img">
        <Image src={article.image.src} alt="" fill sizes="(max-width: 991px) 40vw, 200px" />
      </div>
      <div className="media-body">
        <ul className="meta-list list-unstyled mb-1">
          <li>
            <Icon name="calendar3" />
            <time dateTime={isoDateTime(article.publishedAt)}>{formatDate(article.publishedAt)}</time>
          </li>
        </ul>
        <h3>
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
      </div>
    </article>
  );
}
