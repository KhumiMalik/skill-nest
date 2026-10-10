import Form from "next/form";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { ResultsSummary } from "@/components/ui/ResultsSummary";
import type { Paginated } from "@/lib/api/schemas";
import { addMonths, formatDayKey, formatMonth } from "@/lib/dates";
import { calendarWeeks, eventsByDay } from "../calendar";
import { type EventFilters, eventsHref } from "../filters";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS } from "../schemas";
import type { EventSummary } from "../types";
import { EventRow } from "./EventRow";

type ToolbarProps = {
  filters: EventFilters;
  /** The month currently shown ("2026-10"), used to build the month menu around it. */
  currentMonth: string;
};

/** Month and category filters (a GET form) and the list/calendar switch (links). */
export function EventsToolbar({ filters, currentMonth }: ToolbarProps) {
  // Six months back to a year ahead covers the school year in both directions.
  const months = Array.from({ length: 19 }, (_, index) => addMonths(currentMonth, index - 6));
  const views = [
    { view: "list" as const, label: "List", icon: "list" as const },
    { view: "calendar" as const, label: "Calendar", icon: "calendar3" as const },
  ];

  return (
    <div className="events-toolbar">
      <Form
        action="/events"
        // A new key resets the selects when the URL changes (e.g. via a link).
        key={`${filters.month}-${filters.category}-${filters.view}`}
        className="events-filter-form"
        aria-label="Filter events"
      >
        {filters.view === "calendar" && <input type="hidden" name="view" value="calendar" />}
        <div>
          <label htmlFor="event-month" className="form-label">
            Month
          </label>
          <select id="event-month" name="month" defaultValue={filters.month ?? ""} className="form-select">
            <option value="">{filters.view === "calendar" ? "This month" : "All upcoming"}</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="event-category" className="form-label">
            Category
          </label>
          <select id="event-category" name="category" defaultValue={filters.category ?? ""} className="form-select">
            <option value="">All categories</option>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {EVENT_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-main">
          Show events
        </button>
      </Form>

      <nav aria-label="Events view">
        <ul className="view-toggle">
          {views.map(({ view, label, icon }) => (
            <li key={view}>
              <Link
                href={eventsHref({ month: filters.month, category: filters.category, view })}
                className={filters.view === view ? "active" : undefined}
                aria-current={filters.view === view ? "page" : undefined}
              >
                <Icon name={icon} /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/** "‹ October 2026 ›" heading with links to the previous and next month. */
function MonthNav({ month, filters }: { month: string; filters: EventFilters }) {
  const previous = addMonths(month, -1);
  const next = addMonths(month, 1);
  return (
    <div className="month-nav">
      <Link
        href={eventsHref({ ...filters, month: previous, page: 1 })}
        aria-label={`Previous month, ${formatMonth(previous)}`}
      >
        <Icon name="chevron-left" />
      </Link>
      <h2>{formatMonth(month)}</h2>
      <Link href={eventsHref({ ...filters, month: next, page: 1 })} aria-label={`Next month, ${formatMonth(next)}`}>
        <Icon name="chevron-right" />
      </Link>
    </div>
  );
}

type EventListProps = { filters: EventFilters; result: Paginated<EventSummary> };

/** List view: the selected month, or every upcoming event when no month is chosen. */
export function EventList({ filters, result }: EventListProps) {
  const filtersText = filters.category ? ` in ${EVENT_CATEGORY_LABELS[filters.category]}` : "";
  return (
    <>
      {filters.month ? <MonthNav month={filters.month} filters={filters} /> : <h2 className="h3">Upcoming events</h2>}
      <ResultsSummary
        meta={result.meta}
        noun="events"
        filtersText={filtersText}
        emptyText="There are no events matching these filters."
      />
      {result.data.length === 0 ? (
        <div className="empty-state">
          <p>Try another month or category.</p>
          <Link href="/events" className="btn-outline-main">
            See all upcoming events
          </Link>
        </div>
      ) : (
        <ul className="list-unstyled">
          {result.data.map((event) => (
            <li key={event.slug}>
              <EventRow event={event} />
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={result.meta.page}
        totalPages={result.meta.totalPages}
        hrefForPage={(page) => eventsHref({ ...filters, page })}
      />
    </>
  );
}

const WEEKDAYS = [
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"],
  ["Sun", "Sunday"],
] as const;

type EventCalendarProps = {
  filters: EventFilters;
  month: string;
  events: EventSummary[];
  /** Today's day key, highlighted in the grid. */
  today: string;
};

/**
 * Month grid rendered on the server, with a link for every event. It is a real <table>, so
 * screen readers can move by row and column. On small screens it becomes a list of the days
 * that have events (see styles/_listings.scss).
 */
export function EventCalendar({ filters, month, events, today }: EventCalendarProps) {
  const byDay = eventsByDay(events, month);

  return (
    <>
      <MonthNav month={month} filters={filters} />
      {events.length === 0 && (
        <p className="results-summary" role="status">
          There are no events this month{filters.category ? ` in ${EVENT_CATEGORY_LABELS[filters.category]}` : ""}.
        </p>
      )}
      <table className="event-calendar">
        <caption className="visually-hidden">Events in {formatMonth(month)}</caption>
        <thead>
          <tr>
            {WEEKDAYS.map(([short, long]) => (
              <th key={short} scope="col">
                <abbr title={long}>{short}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks(month).map((week) => (
            <tr key={week.find(Boolean)}>
              {week.map((day, index) => {
                if (!day) return <td key={`empty-${index}`} className="cal-empty" />;
                const dayEvents = byDay.get(day) ?? [];
                const classes = ["cal-day", dayEvents.length > 0 && "has-events", day === today && "is-today"];
                return (
                  <td
                    key={day}
                    className={classes.filter(Boolean).join(" ")}
                    aria-current={day === today ? "date" : undefined}
                  >
                    <span className="cal-date">
                      <span className="cal-number" aria-hidden="true">
                        {Number(day.slice(8))}
                      </span>
                      <span className="cal-full-date">{formatDayKey(day)}</span>
                    </span>
                    {dayEvents.length > 0 && (
                      <ul>
                        {dayEvents.map((event) => (
                          <li key={event.slug}>
                            <Link href={`/events/${event.slug}`} className={`cal-event ${event.category}`}>
                              {event.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
