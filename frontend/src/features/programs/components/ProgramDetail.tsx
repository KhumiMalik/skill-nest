import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PROGRAM_LEVEL_LABELS } from "../constants";
import type { Program, ProgramSummary } from "../types";

type ProgramDetailProps = {
  program: Program;
  /** Other programs in the same stage, for the sidebar. */
  related: ProgramSummary[];
};

export function ProgramDetail({ program, related }: ProgramDetailProps) {
  const level = PROGRAM_LEVEL_LABELS[program.level];
  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: "person", label: "Ages", value: program.ageRange },
    { icon: "clock", label: "Duration", value: program.duration },
    { icon: "people-fill", label: "Class size", value: program.classSize },
    { icon: "calendar-event", label: "Entry", value: program.intake },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="row g-5">
          <article className="col-lg-8">
            <div className="article">
              <Image
                src={program.image.src}
                alt={program.image.alt}
                width={program.image.width}
                height={program.image.height}
                sizes="(max-width: 991px) 100vw, 760px"
                className="rounded-img article-cover"
                preload
              />
              <span className="eyebrow">{level}</span>
              <p className="lead">{program.summary}</p>

              <h2>Overview</h2>
              {program.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {program.subjects.length > 0 && (
                <>
                  <h2>What pupils learn</h2>
                  <ul className="check-list check-list-columns">
                    {program.subjects.map((subject) => (
                      <li key={subject}>{subject}</li>
                    ))}
                  </ul>
                </>
              )}

              {program.highlights.length > 0 && (
                <>
                  <h2>Highlights</h2>
                  <ul className="check-list">
                    {program.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </article>

          <aside className="col-lg-4" aria-label="Program details">
            <div className="sidebar-box">
              <h2>Key facts</h2>
              <dl className="facts-list">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>
                      <Icon name={fact.icon} /> {fact.label}
                    </dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="sidebar-box">
              <h2>Interested?</h2>
              <p>Come and see {level} lessons in action, or start your application today.</p>
              <div className="d-grid gap-2">
                <Link href="/admissions" className="btn-main justify-content-center">
                  Apply now
                </Link>
                <Link href="/contact" className="btn-outline-main justify-content-center">
                  Book a visit
                </Link>
              </div>
            </div>

            {related.length > 0 && (
              <div className="sidebar-box">
                <h2>More {level} programs</h2>
                <ul className="plain">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/programs/${item.slug}`}>{item.title}</Link>
                      <span>{item.ageRange}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
