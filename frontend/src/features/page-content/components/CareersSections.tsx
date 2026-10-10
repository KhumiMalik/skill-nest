import { SectionTitle } from "@/components/ui/SectionTitle";
import type { CareersPage } from "../types";
import { StepList } from "./AdmissionsSections";
import { ContentImage, IconCardList } from "./IntroSection";

/** Why work at Greenfield: introduction and staff benefits. */
export function CareersIntro({ page }: { page: CareersPage }) {
  const { intro } = page;

  return (
    <section id="working-here" className="section">
      <div className="container">
        <div className="row align-items-center gy-5 mb-5">
          <div className="col-lg-6 reveal">
            <span className="eyebrow">{intro.eyebrow}</span>
            <h2 className="mb-3">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="col-lg-6 reveal">
            <ContentImage image={intro.image} sizes="(max-width: 991px) 100vw, 50vw" />
          </div>
        </div>
        <SectionTitle title="Staff Benefits" subtitle="What we offer everyone who works at Greenfield." />
        <IconCardList cards={page.benefits} fallbackIcon="star" />
      </div>
    </section>
  );
}

/** How recruitment works, and the safer recruitment statement. */
export function RecruitmentSection({ page }: { page: CareersPage }) {
  return (
    <section id="how-to-apply" className="section">
      <div className="container">
        <SectionTitle title="How to Apply" subtitle="Our recruitment process, from application to first day." />
        <StepList steps={page.process} />
        <div className="safeguarding-note reveal mt-5" role="note">
          <h3 className="h5">Safeguarding</h3>
          <p className="mb-0">{page.safeguarding}</p>
        </div>
      </div>
    </section>
  );
}
