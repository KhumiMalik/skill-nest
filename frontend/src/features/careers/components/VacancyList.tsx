import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatDate, formatTime } from "@/lib/dates";
import { CONTRACT_TYPE_LABELS, STAFF_CATEGORY_LABELS, WORKING_PATTERN_LABELS } from "../schemas";
import type { VacancySummary } from "../types";

type VacancyListProps = {
  vacancies: VacancySummary[];
  /** Where to send speculative applications when nothing is open. */
  contactEmail: string;
};

/** Open vacancies, or a note inviting speculative applications when there are none. */
export function VacancyList({ vacancies, contactEmail }: VacancyListProps) {
  if (vacancies.length === 0) {
    return (
      <div className="card-box text-center">
        <p className="mb-0">
          There are no vacancies at the moment. We are always glad to hear from talented teachers and support staff:
          send your CV to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </div>
    );
  }

  return (
    <ul className="list-unstyled mb-0">
      {vacancies.map((vacancy) => (
        <li className="vacancy-row reveal" key={vacancy.slug}>
          <div className="vacancy-main">
            <span className="vacancy-type">{STAFF_CATEGORY_LABELS[vacancy.category]}</span>
            <h3>
              <Link href={`/careers/${vacancy.slug}`}>{vacancy.title}</Link>
            </h3>
            <p>{vacancy.summary}</p>
            <ul className="vacancy-meta list-unstyled mb-0">
              <li>
                <Icon name="briefcase" /> {vacancy.department}
              </li>
              <li>
                <Icon name="clock" /> {CONTRACT_TYPE_LABELS[vacancy.contract]},{" "}
                {WORKING_PATTERN_LABELS[vacancy.pattern].toLowerCase()}
              </li>
              <li>
                <Icon name="cash-stack" /> {vacancy.salary}
              </li>
            </ul>
          </div>
          <p className="vacancy-closing">
            <span>Closing date</span>
            <strong>
              <time dateTime={vacancy.closesAt}>{formatDate(vacancy.closesAt)}</time>
            </strong>
            <span>at {formatTime(vacancy.closesAt)}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
