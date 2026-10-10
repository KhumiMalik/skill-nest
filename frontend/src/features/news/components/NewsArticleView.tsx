import Image from "next/image";
import Link from "next/link";
import { ContentBlocks, readingMinutes, TableOfContents } from "@/components/ui/ContentBlocks";
import { Icon } from "@/components/ui/Icon";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { formatDate, isoDateTime } from "@/lib/dates";
import { newsHref } from "../filters";
import { NEWS_CATEGORY_LABELS } from "../schemas";
import type { NewsArticle } from "../types";

/** The full article. The page's h1 (the title) is in the banner, so sections here are h2. */
export function NewsArticleView({ article }: { article: NewsArticle }) {
  return (
    <article className="article">
      <Image
        src={article.image.src}
        alt={article.image.alt}
        width={article.image.width}
        height={article.image.height}
        sizes="(max-width: 991px) 100vw, 760px"
        className="rounded-img article-cover"
        preload
      />
      <ul className="meta-list list-unstyled">
        <li>
          <Icon name="person" />
          {article.author.name}
        </li>
        <li>
          <Icon name="calendar3" />
          <time dateTime={isoDateTime(article.publishedAt)}>{formatDate(article.publishedAt)}</time>
        </li>
        <li>
          <Icon name="clock" />
          {readingMinutes(article.body)} min read
        </li>
        <li>
          <Icon name="book" />
          <Link href={newsHref({ category: article.category })}>{NEWS_CATEGORY_LABELS[article.category]}</Link>
        </li>
      </ul>
      <p className="lead">{article.excerpt}</p>

      <TableOfContents blocks={article.body} />
      <ContentBlocks blocks={article.body} />

      <div className="article-footer">
        {article.tags.length > 0 && (
          <div>
            <h2>Related topics</h2>
            <ul className="tag-list">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Link href={newsHref({ q: tag })}>{tag}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h2>Share this article</h2>
          <ShareLinks path={`/news/${article.slug}`} title={article.title} />
        </div>
      </div>

      <div className="author-box">
        <Image
          src={article.author.photo.src}
          alt=""
          width={article.author.photo.width}
          height={article.author.photo.height}
          sizes="90px"
        />
        <div>
          <p className="author-name">{article.author.name}</p>
          <p className="author-role">{article.author.role}</p>
          <p className="mb-0">{article.author.bio}</p>
        </div>
      </div>
    </article>
  );
}
