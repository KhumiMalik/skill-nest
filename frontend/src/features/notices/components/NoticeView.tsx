import Link from "next/link";
import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { Icon } from "@/components/ui/Icon";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { formatDate, isoDateTime } from "@/lib/dates";
import { noticesHref } from "../filters";
import { NOTICE_CATEGORY_LABELS } from "../schemas";
import type { Notice, NoticeSummary } from "../types";

type NoticeViewProps = {
  notice: Notice;
  /** Other recent notices for the sidebar. */
  others: NoticeSummary[];
};

export function NoticeView({ notice, others }: NoticeViewProps) {
  return (
    <div className="row g-4">
      <article className="col-lg-8">
        <div className="article">
          <ul className="meta-list list-unstyled">
            <li>
              <Icon name="calendar3" />
              <time dateTime={isoDateTime(notice.publishedAt)}>{formatDate(notice.publishedAt)}</time>
            </li>
            <li>
              <Icon name="megaphone" />
              <Link href={noticesHref({ category: notice.category })}>{NOTICE_CATEGORY_LABELS[notice.category]}</Link>
            </li>
            {notice.audience.length > 0 && (
              <li>
                <Icon name="people" />
                For: {notice.audience.join(", ")}
              </li>
            )}
          </ul>
          {notice.important && (
            <p className="notice-important">
              <Icon name="exclamation-circle" /> Important notice
            </p>
          )}
          <p className="lead">{notice.summary}</p>
          <ContentBlocks blocks={notice.body} />

          <div className="article-footer">
            {notice.contact && (
              <div>
                <h2>Questions?</h2>
                <p className="mb-0">
                  Contact the {notice.contact.name}:{" "}
                  <a href={`mailto:${notice.contact.email}`} className="text-break">
                    {notice.contact.email}
                  </a>
                </p>
              </div>
            )}
            <div>
              <h2>Share this notice</h2>
              <ShareLinks path={`/notices/${notice.slug}`} title={notice.title} />
            </div>
          </div>
        </div>
      </article>

      <aside className="col-lg-4" aria-label="More notices">
        {others.length > 0 && (
          <div className="sidebar-box">
            <h2>Latest notices</h2>
            <ul className="plain">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link href={`/notices/${other.slug}`}>{other.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link href="/notices" className="link-arrow">
          <Icon name="arrow-left" /> Back to the notice board
        </Link>
      </aside>
    </div>
  );
}
