import Link from "next/link";
import type { ReactNode } from "react";
import { FileList } from "@/components/ui/FileList";
import { Icon, toIconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { siteConfig } from "@/config/site";
import { formatDay } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import type { AdmissionsPage, Step } from "../types";
import { CtaBand } from "./CtaBand";
import { ContentImage } from "./IntroSection";

/** Overview, the admission process, requirements and key dates. */
export function AdmissionsOverview({ page }: { page: AdmissionsPage }) {
  const { intro, requirements, deadlines } = page;

  return (
    <section id="admissions" className="section">
      <div className="container">
        <div className="row align-items-center gy-5 mb-5">
          <div className="col-lg-6 reveal">
            <span className="eyebrow">{intro.eyebrow}</span>
            <h2 className="mb-3">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="check-list">
              {intro.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="col-lg-6 reveal">
            <ContentImage image={intro.image} sizes="(max-width: 991px) 100vw, 50vw" />
          </div>
        </div>

        <SectionTitle
          title="Admission Process"
          subtitle="Four steps from your first enquiry to a place at Greenfield."
        />
        <StepList steps={page.steps} />

        <div className="row g-4 mt-2">
          <div className="col-lg-6 reveal">
            <div className="card-box">
              <h3 className="mt-0 mb-4">Requirements</h3>
              <ul className="list-unstyled mb-0">
                {requirements.map((requirement) => (
                  <li className="highlight" key={requirement.title}>
                    <div className="icon-circle">
                      <Icon name={toIconName(requirement.icon, "check-circle")} />
                    </div>
                    <div>
                      <h4 className="highlight-label">{requirement.title}</h4>
                      <p>{requirement.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-6 reveal">
            <div className="card-box">
              <h3 className="mt-0 mb-3">{deadlines.title}</h3>
              <ul className="list-unstyled mb-0">
                {deadlines.entries.map((entry) => (
                  <li className="deadline-row" key={entry.title}>
                    <div>
                      <h4>{entry.title}</h4>
                      <p>{entry.text}</p>
                    </div>
                    <time className="date" dateTime={entry.date}>
                      {formatDay(entry.date, "short")}
                    </time>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Numbered step cards. A real ordered list, so screen readers announce "1 of 4". */
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="row g-4 list-unstyled mb-0">
      {steps.map((step, index) => (
        <li className="col-lg-3 col-md-6 reveal" key={step.title}>
          <div className="card-box step-card">
            <span className="step-num" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The fee table and downloadable forms. */
export function FeesSection({ fees, documents }: Pick<AdmissionsPage, "fees" | "documents">) {
  return (
    <section id="fees" className="section section-alt">
      <div className="container">
        <SectionTitle title="Fees & Forms" subtitle="Termly fees for each stage, and the forms you need to apply." />
        <div className="row g-4">
          <div className="col-lg-7 reveal">
            <div className="card-box">
              <h3 className="mt-0 mb-3">{fees.title}</h3>
              <div className="table-scroll">
                <table className="fees-table">
                  <thead>
                    <tr>
                      <th scope="col">Stage</th>
                      <th scope="col">Year groups</th>
                      <th scope="col" className="text-end">
                        Fee per term
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.rows.map((row) => (
                      <tr key={row.stage}>
                        <th scope="row">{row.stage}</th>
                        <td>{row.years}</td>
                        <td className="text-end">{formatCurrency(row.termFee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fees.notes.length > 0 && (
                <ul className="fees-notes">
                  {fees.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="col-lg-5 reveal">
            <div id="forms" className="card-box">
              <h3 className="mt-0 mb-3">Forms & Documents</h3>
              <FileList files={documents} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type AdmissionsContactProps = Pick<AdmissionsPage, "visit" | "apply"> & {
  /** The enquiry form (from the admissions feature), placed in the left column. */
  form: ReactNode;
};

/** The enquiry form, visiting and applying. */
export function AdmissionsContact({ visit, apply, form }: AdmissionsContactProps) {
  const { phone, admissionsEmail } = siteConfig.contact;

  return (
    <section id="enquire" className="section">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-7 reveal">
            <div className="form-card h-100">
              <h2 className="h3 mb-2">Request Information</h2>
              <p className="mb-4">
                Ask us a question, request a prospectus or arrange a visit. You can also email{" "}
                <a href={`mailto:${admissionsEmail}`}>{admissionsEmail}</a> or call{" "}
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>.
              </p>
              {form}
            </div>
          </div>
          {/* Stacked cards: the visit card keeps its natural height (.card-box is height: 100% by default). */}
          <div className="col-lg-5 reveal d-flex flex-column gap-4">
            <div className="card-box h-auto">
              <div className="icon-circle accent">
                <Icon name="geo-alt" />
              </div>
              <h2 className="h3">{visit.title}</h2>
              <p className="mb-3">{visit.text}</p>
              <Link href="/contact" className="btn-outline-main">
                Schedule a Visit
              </Link>
            </div>
            <CtaBand cta={apply} />
          </div>
        </div>
      </div>
    </section>
  );
}
