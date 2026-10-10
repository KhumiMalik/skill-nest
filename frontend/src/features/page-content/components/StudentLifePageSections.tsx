import Image from "next/image";
import { Icon, toIconName } from "@/components/ui/Icon";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { type TabItem, Tabs } from "@/components/ui/Tabs";
import type { Cta, IconCard, StudentLifePage } from "../types";
import { CtaBand } from "./CtaBand";
import { ContentImage, IconCardList, IntroWithStats } from "./IntroSection";

// Sections of the /student-life page. (The home page's "Student Life" teaser is StudentLifeSection.)

export function StudentLifeIntro({ page }: { page: StudentLifePage }) {
  return (
    <section id="students-life" className="section">
      <div className="container">
        <IntroWithStats intro={page.intro} />
        <h2 className="visually-hidden">Highlights</h2>
        <IconCardList cards={page.highlights} fallbackIcon="star" />
      </div>
    </section>
  );
}

/** Clubs, arts, leadership and service: one tab each. */
export function ActivitiesSection({ activities }: { activities: StudentLifePage["activities"] }) {
  const tabs: TabItem[] = activities.map((activity) => ({
    id: activity.id,
    label: activity.label,
    panel: (
      <div className="row g-4 align-items-center">
        <div className="col-lg-6">
          <ContentImage image={activity.image} sizes="(max-width: 991px) 100vw, 50vw" />
        </div>
        <div className="col-lg-6">
          <h3>{activity.title}</h3>
          <p>{activity.text}</p>
          <ul className="check-list">
            {activity.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
  }));

  return (
    <section id="activities" className="section section-alt">
      <div className="container">
        <SectionTitle
          title="Activities & Organisations"
          subtitle="More than 85 clubs and societies meet every week, at lunchtime and after school."
        />
        <div className="reveal">
          <Tabs label="Activities" tabs={tabs} />
        </div>
      </div>
    </section>
  );
}

/** Sports teams in a horizontal scroller, as in the template. */
export function TeamsSection({ teams }: { teams: StudentLifePage["teams"] }) {
  if (teams.length === 0) return null;

  return (
    <section id="athletics" className="section">
      <div className="container">
        <SectionTitle
          id="athletics-title"
          title="Athletics"
          subtitle="Competitive teams in every major sport, and a place for everyone who wants to play."
        />
        {/* A scrollable area must be reachable with the keyboard (it has no links inside), hence tabIndex. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="scroller reveal" role="region" aria-labelledby="athletics-title" tabIndex={0}>
          {teams.map((team) => (
            <article className="media-card" key={team.name}>
              <div className="media-img">
                <Image
                  src={team.image.src}
                  alt={team.image.alt}
                  width={team.image.width}
                  height={team.image.height}
                  sizes="300px"
                />
              </div>
              <div className="media-body">
                <h3>{team.name}</h3>
                <p>{team.text}</p>
                <div className="media-footer">
                  <span>
                    <Icon name="trophy" /> {team.honours}
                  </span>
                  <span>
                    <Icon name="people" /> {team.members} members
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Facilities pupils use every day, with photos that open in a lightbox. */
export function StudentFacilitiesSection({ facilities }: { facilities: StudentLifePage["facilities"] }) {
  return (
    <section id="facilities" className="section section-alt">
      <div className="container">
        <div className="row gy-5 align-items-center">
          <div className="col-lg-7 reveal">
            <span className="eyebrow">Facilities</span>
            <h2 className="mb-4">{facilities.title}</h2>
            <ul className="row g-4 list-unstyled mb-0">
              {facilities.cards.map((card) => (
                <li className="col-md-6 highlight" key={card.title}>
                  <div className="icon-circle">
                    <Icon name={toIconName(card.icon, "building")} />
                  </div>
                  <div>
                    <h3 className="highlight-label">{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-5 reveal">
            <PhotoGrid
              photos={facilities.photos}
              label="Student facilities photos"
              rowClassName="row g-3"
              columnClassName="col-6"
              sizes="(max-width: 991px) 50vw, 20vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type SupportSectionProps = { support: IconCard[]; cta: Cta };

/** Pastoral and support services, and a call to action. */
export function SupportSection({ support, cta }: SupportSectionProps) {
  return (
    <section id="support" className="section">
      <div className="container">
        <SectionTitle
          title="Student Support Services"
          subtitle="Help with learning, wellbeing and the next steps, whenever a pupil needs it."
        />
        <IconCardList cards={support} fallbackIcon="heart" />
        <div className="row mt-5">
          <div className="col-md-8 offset-md-2 text-center reveal">
            <CtaBand cta={cta} />
          </div>
        </div>
      </div>
    </section>
  );
}
