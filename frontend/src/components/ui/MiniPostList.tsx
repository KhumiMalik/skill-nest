import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ApiImage } from "@/lib/api/schemas";
import { formatDate, isoDateTime } from "@/lib/dates";

/** `href` is a site path built from data, e.g. `/news/${slug}`. */
export type MiniPost = { href: string; title: string; image: ApiImage; date: string };

/** Small thumbnail + title + date list for sidebars ("Recent posts", "Upcoming events"). */
export function MiniPostList({ posts }: { posts: MiniPost[] }) {
  return (
    <ul className="list-unstyled mb-0">
      {posts.map((post) => (
        <li key={post.href} className="mini-post">
          <Image src={post.image.src} alt="" width={80} height={64} sizes="80px" />
          <div>
            <h3>
              {/* Typed routes can only check slugs written inline in a <Link>; these come from data. */}
              <Link href={post.href as Route}>{post.title}</Link>
            </h3>
            <time dateTime={isoDateTime(post.date)}>{formatDate(post.date)}</time>
          </div>
        </li>
      ))}
    </ul>
  );
}
