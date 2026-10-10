import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { FileList } from "@/components/ui/FileList";
import { Icon } from "@/components/ui/Icon";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { formatDate, formatTime } from "@/lib/dates";
import { JsonLd } from "@/components/seo/JsonLd";
import { hasVacancyClosed } from "../data";
import { jobPostingJsonLd } from "../structured-data";
import { CONTRACT_TYPE_LABELS, STAFF_CATEGORY_LABELS, WORKING_PATTERN_LABELS } from "../schemas";
import type { Vacancy } from "../types";

/** JobPosting structured data while the vacancy is open; expired postings must not keep it. */
export async function VacancyJsonLd({ vacancy }: { vacancy: Vacancy }) {
  if (await hasVacancyClosed(vacancy.closesAt)) return null;
  return <JsonLd data={jobPostingJsonLd(vacancy)} />;
}

/** How to apply, or a "closed" note once the closing date has passed (checked hourly, see hasVacancyClosed). */
async function ApplyBox({ vacancy }: { vacancy: Vacancy }) {
  const closing = `${formatDate(vacancy.closesAt)} at ${formatTime(vacancy.closesAt)}`;

  if (await hasVacancyClosed(vacancy.closesAt)) {
    return (
      <div className="sidebar-box">
        <h2>Applications Closed</h2>
        <p className="notice-important mb-0">
          <Icon name="info-circle" /> This vacancy closed on {closing}.
        </p>
      </div>
    );
  }

  const subject = encodeURIComponent(`Application: ${vacancy.title}`);
  return (
    <div className="sidebar-box">
      <h2>How to Apply</h2>
      <p className="small">
        Download the application pack, then email your completed form to{" "}
        <a href={`mailto:${vacancy.contact.email}?subject=${subject}`} className="text-break">
          {vacancy.contact.email}
        </a>{" "}
        by <strong>{closing}</strong>. We do not accept CVs on their own.
      </p>
      {vacancy.applicationPack && <FileList files={[vacancy.applicationPack]} />}
    </div>
  );
}

export function VacancyDetail({ vacancy }: { vacancy: Vacancy }) {
  const facts = [
    { label: "Department", value: vacancy.department },
    { label: "Staff type", value: STAFF_CATEGORY_LABELS[vacancy.category] },
    {
      label: "Contract",
      value: `${CONTRACT_TYPE_LABELS[vacancy.contract]}, ${WORKING_PATTERN_LABELS[vacancy.pattern].toLowerCase()}`,
    },
    { label: "Salary", value: vacancy.salary },
    { label: "Start date", value: vacancy.startDate },
  ];

  return (
    <div className="row g-4">
      <article className="col-lg-8">
        <div className="article">
          <p className="lead-text">{vacancy.summary}</p>
          <ContentBlocks blocks={vacancy.description} />

          {vacancy.responsibilities.length > 0 && (
            <>
              <h2>Main Responsibilities</h2>
              <ul className="check-list">
                {vacancy.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {vacancy.requirements.length > 0 && (
            <>
              <h2>What We Are Looking For</h2>
              <ul className="check-list">
                {vacancy.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <div className="article-footer">
            <div>
              <h2>Share this vacancy</h2>
              <ShareLinks path={`/careers/${vacancy.slug}`} title={vacancy.title} />
            </div>
          </div>
        </div>
      </article>

      <aside className="col-lg-4" aria-label="Vacancy information">
        <div className="sidebar-box">
          <h2>Key Facts</h2>
          <dl className="facts-list">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ApplyBox vacancy={vacancy} />
        <div className="sidebar-box">
          <h2>Questions?</h2>
          <p className="mb-1">
            <strong>{vacancy.contact.name}</strong>
          </p>
          <p className="small mb-2">{vacancy.contact.role}</p>
          <p className="small mb-0">
            <Icon name="envelope" />{" "}
            <a href={`mailto:${vacancy.contact.email}`} className="text-break">
              {vacancy.contact.email}
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
}
