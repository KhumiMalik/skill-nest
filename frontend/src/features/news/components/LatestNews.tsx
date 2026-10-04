import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { NewsSummary } from "../types";
import { NewsCard } from "./NewsCard";

export function LatestNews({ articles }: { articles: NewsSummary[] }) {
  if (articles.length === 0) return null;

  return (
    <section id="recent-news" className="section">
      <div className="container">
        <SectionTitle
          title="Recent News"
          subtitle="Achievements, events and everyday moments from around the school."
        />
        <ul className="row g-4 list-unstyled">
          {articles.map((article) => (
            <li className="col-lg-4 reveal" key={article.slug}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
        <div className="text-center mt-5">
          <Link href="/news" className="btn-pill btn-wide">
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}
