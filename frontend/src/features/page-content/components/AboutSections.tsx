import Image from "next/image";
import { Icon, toIconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { AboutPage } from "../types";
import { StatValue } from "./StatValue";

/** History, mission and vision, core values and the milestones timeline. */
export function HistorySection({ about }: { about: AboutPage }) {
  const { history, milestones } = about;

  return (
    <section id="history" className="section">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6 reveal">
            <span className="eyebrow">Our History</span>
            <h2 className="mb-3">{history.title}</h2>
            {history.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="row text-center mt-4 list-unstyled">
              {history.stats.map((stat) => (
                <li className="col-4" key={stat.label}>
                  <div className="stat-box p-2">
                    <span className="num">
                      <StatValue stat={stat} />
                    </span>
                    <p>{stat.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-6 reveal">
            <Image
              src={history.image.src}
              alt={history.image.alt}
              width={history.image.width}
              height={history.image.height}
              sizes="(max-width: 991px) 100vw, 50vw"
              className="rounded-img"
            />
          </div>
        </div>

        <div className="row g-4 mt-5">
          <div className="col-lg-6 reveal">
            <div className="card-box">
              <div className="icon-circle">
                <Icon name="bullseye" />
              </div>
              <h3>Our Mission</h3>
              <p>{about.mission}</p>
            </div>
          </div>
          <div className="col-lg-6 reveal">
            <div className="card-box">
              <div className="icon-circle accent">
                <Icon name="eye" />
              </div>
              <h3>Our Vision</h3>
              <p>{about.vision}</p>
            </div>
          </div>
        </div>

        <SectionTitle title="Core Values" className="mt-5 pt-4 pb-4" />
        <ul className="row g-4 list-unstyled">
          {about.values.map((value) => (
            <li className="col-lg-3 col-md-6 reveal" key={value.title}>
              <div className="card-box">
                <div className="icon-circle">
                  <Icon name={toIconName(value.icon, "star")} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="row mt-5 pt-4 gy-4 align-items-center">
          <div className="col-lg-5 reveal">
            <span className="eyebrow">Milestones</span>
            <h2>{milestones.title}</h2>
            <p>{milestones.text}</p>
          </div>
          <div className="col-lg-7 reveal">
            <ol className="timeline list-unstyled">
              {milestones.entries.map((entry) => (
                <li className="timeline-entry" key={`${entry.year}-${entry.title}`}>
                  <span className="year">{entry.year}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The Head's welcome message with photo and signature. */
export function HeadMessageSection({ message }: { message: AboutPage["headMessage"] }) {
  return (
    <section id="head-message" className="section section-alt">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-5 reveal">
            <Image
              src={message.photo.src}
              alt={message.photo.alt}
              width={message.photo.width}
              height={message.photo.height}
              sizes="(max-width: 991px) 100vw, 40vw"
              className="rounded-img"
            />
          </div>
          <div className="col-lg-7 reveal">
            <span className="eyebrow">Welcome</span>
            <h2 className="mb-3">{message.title}</h2>
            <blockquote className="head-message">
              {message.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <div className="signature-row">
              <span className="signature" aria-hidden="true">
                {message.name}
              </span>
              <div>
                <strong>{message.name}</strong>
                <span>{message.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
