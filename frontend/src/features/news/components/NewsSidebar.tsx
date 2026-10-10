import Link from "next/link";
import { MiniPostList } from "@/components/ui/MiniPostList";
import { newsHref } from "../filters";
import { NEWS_CATEGORY_LABELS } from "../schemas";
import type { NewsCategoryCount, NewsSummary } from "../types";
import { NewsSearchForm } from "./NewsList";

type NewsSidebarProps = {
  categories: NewsCategoryCount[];
  recent: NewsSummary[];
};

/** Search, categories with counts and recent posts, next to an article. */
export function NewsSidebar({ categories, recent }: NewsSidebarProps) {
  return (
    <aside aria-label="More news">
      <div className="sidebar-box">
        <h2>Search</h2>
        <NewsSearchForm />
      </div>
      <div className="sidebar-box">
        <h2>Categories</h2>
        <ul className="plain">
          {categories.map(({ category, count }) => (
            <li key={category}>
              <Link href={newsHref({ category })}>{NEWS_CATEGORY_LABELS[category]}</Link>
              <span>({count})</span>
            </li>
          ))}
        </ul>
      </div>
      {recent.length > 0 && (
        <div className="sidebar-box">
          <h2>Recent Posts</h2>
          <MiniPostList
            posts={recent.map((article) => ({
              href: `/news/${article.slug}`,
              title: article.title,
              image: article.image,
              date: article.publishedAt,
            }))}
          />
        </div>
      )}
    </aside>
  );
}
