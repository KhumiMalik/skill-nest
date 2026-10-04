import Image from "next/image";
import Link from "next/link";
import { formatDate, isoDateTime } from "@/lib/dates";
import { NEWS_CATEGORY_LABELS } from "../schemas";
import type { NewsSummary } from "../types";

export function NewsCard({ article }: { article: NewsSummary }) {
  return (
    <article className="news-card">
      <Image
        src={article.image.src}
        alt={article.image.alt}
        width={article.image.width}
        height={article.image.height}
        sizes="(max-width: 991px) 100vw, 33vw"
      />
      <div className="news-body">
        <span className="news-cat">{NEWS_CATEGORY_LABELS[article.category]}</span>
        <h3>
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        <div className="news-author">
          <Image
            src={article.author.photo.src}
            alt=""
            width={article.author.photo.width}
            height={article.author.photo.height}
            sizes="64px"
          />
          <div>
            <strong>{article.author.name}</strong>
            <time dateTime={isoDateTime(article.publishedAt)}>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </div>
    </article>
  );
}
