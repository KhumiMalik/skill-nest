import Image from "next/image";
import Link from "next/link";
import type { ProgramsPage } from "../types";
import { StatValue } from "./StatValue";

/** Introduction and key figures at the top of the programs page. */
export function ProgramsIntro({ intro, stats }: Pick<ProgramsPage, "intro" | "stats">) {
  return (
    <div className="row align-items-center gy-5 mb-5">
      <div className="col-lg-6 reveal">
        <span className="eyebrow">{intro.eyebrow}</span>
        <h2 className="mb-3">{intro.title}</h2>
        {intro.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Link href="/admissions" className="btn-main mt-2">
          Apply Now
        </Link>
      </div>
      <div className="col-lg-6 reveal">
        <ul className="row g-3 list-unstyled mb-0">
          {stats.map((stat) => (
            <li className="col-6" key={stat.label}>
              <div className="card-box stat-box">
                <span className="num">
                  <StatValue stat={stat} />
                </span>
                <p>{stat.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** One highlighted program at the bottom of the programs page, chosen by the editors. */
export function ProgramSpotlight({ spotlight }: { spotlight: ProgramsPage["spotlight"] }) {
  return (
    <div className="row mt-5 pt-4">
      <div className="col-lg-10 mx-auto reveal">
        <div className="card-box spotlight p-0 overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-5 spotlight-img">
              <Image src={spotlight.image.src} alt={spotlight.image.alt} fill sizes="(max-width: 991px) 100vw, 40vw" />
            </div>
            <div className="col-lg-7 p-4 p-lg-5">
              <span className="eyebrow">{spotlight.eyebrow}</span>
              <h3 className="mt-0">{spotlight.title}</h3>
              <p>{spotlight.text}</p>
              <dl className="row g-3 my-3">
                {spotlight.facts.map((fact) => (
                  <div className="col-4" key={fact.label}>
                    <dt className="h6 mb-1">{fact.label}</dt>
                    <dd className="mb-0">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <Link href={`/programs/${spotlight.programSlug}`} className="btn-main">
                Learn More<span className="visually-hidden"> about the {spotlight.title}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
