import Image from "next/image";
import type { ReactNode } from "react";
import { ContentLink } from "@/components/ui/ContentLink";
import { Icon, toIconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { AlumniPage } from "../types";
import { CtaBand } from "./CtaBand";
import { ContentImage } from "./IntroSection";
import { StatValue } from "./StatValue";

/** Introduction with key figures, and the ways to stay connected. */
export function AlumniIntro({ page }: { page: AlumniPage }) {
  const { intro, connect } = page;

  return (
    <section id="alumni" className="section">
      <div className="container">
        <div className="row align-items-center gy-5 mb-5">
          <div className="col-lg-7 reveal">
            <span className="eyebrow">{intro.eyebrow}</span>
            <h2 className="mb-3">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="mini-stats list-unstyled">
              {intro.stats.map((stat) => (
                <li key={stat.label}>
                  <strong>
                    <StatValue stat={stat} />
                  </strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-5 reveal">
            <ContentImage image={intro.image} sizes="(max-width: 991px) 100vw, 40vw" />
          </div>
        </div>

        <SectionTitle
          title="How to Stay Connected"
          subtitle="Wherever life has taken you, there is a place for you in the Greenfield community."
        />
        <ul className="row g-4 list-unstyled mb-0">
          {connect.map((card, index) => (
            <li className="col-lg-3 col-md-6 reveal" key={card.title}>
              <div className="card-box">
                <div className={index % 2 === 1 ? "icon-circle accent" : "icon-circle"}>
                  <Icon name={toIconName(card.icon, "people")} />
                </div>
                <h3>{card.title}</h3>
                <p className="mb-3">{card.text}</p>
                <ContentLink href={card.link.href} className="link-arrow">
                  {card.link.label} <Icon name="arrow-right" />
                </ContentLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Former pupils' stories. */
export function AlumniSpotlights({ spotlights }: { spotlights: AlumniPage["spotlights"] }) {
  if (spotlights.length === 0) return null;

  return (
    <section id="spotlights" className="section section-alt">
      <div className="container">
        <SectionTitle
          title="Notable Alumni Spotlights"
          subtitle="A few of the many former pupils doing remarkable things around the world."
        />
        <ul className="row g-4 list-unstyled mb-0">
          {spotlights.map((person) => (
            <li className="col-lg-4 col-md-6 reveal" key={person.name}>
              <article className="testimonial m-0 h-100">
                <Image
                  src={person.photo.src}
                  alt={person.photo.alt}
                  width={person.photo.width}
                  height={person.photo.height}
                  sizes="96px"
                />
                <h3 className="h4 mt-0">{person.name}</h3>
                <span>
                  Class of {person.classOf} &middot; {person.role}
                </span>
                <p className="mt-3 mb-0">{person.story}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type AlumniEventsSectionProps = {
  /** The upcoming alumni events list (rendered by the events feature). */
  events: ReactNode;
  giving: AlumniPage["giving"];
};

/** Upcoming alumni events next to the giving call to action. */
export function AlumniEventsSection({ events, giving }: AlumniEventsSectionProps) {
  return (
    <section id="alumni-events" className="section">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-7 reveal">
            <div className="card-box">
              <h2 className="h3 mt-0 mb-3">Upcoming Alumni Events</h2>
              {events}
            </div>
          </div>
          <div className="col-lg-5 reveal">
            <CtaBand cta={giving} className="h-100" />
          </div>
        </div>
      </div>
    </section>
  );
}
