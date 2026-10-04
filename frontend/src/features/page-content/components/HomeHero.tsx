import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, toIconName } from "@/components/ui/Icon";
import type { HomePage, Stat } from "../types";
import { formatStat } from "./StatValue";

type HomeHeroProps = {
  hero: HomePage["hero"];
  highlights: Stat[];
  /** Rendered at the bottom of the hero (the upcoming events strip). */
  children?: ReactNode;
};

export function HomeHero({ hero, highlights, children }: HomeHeroProps) {
  return (
    <section id="hero" className="hero">
      {/* The hero image is the largest element on the page, so it is preloaded. It sits behind
          the text as decoration, hence the empty alt. */}
      <Image src={hero.image.src} alt="" fill preload sizes="100vw" className="hero-bg" />
      <div className="hero-main">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <h1>{hero.title}</h1>
              <p className="lead">{hero.lead}</p>
              <div className="hero-buttons">
                <Link href="/admissions" className="btn-main">
                  Start Your Journey
                </Link>
                <Link href="/programs" className="btn-dark-main">
                  Discover Programs
                </Link>
              </div>
            </div>
            {highlights.length > 0 && (
              <div className="col-lg-5 offset-lg-1">
                <div className="why-box">
                  <h2>Why Choose Us</h2>
                  <ul className="row g-4 list-unstyled mb-0">
                    {highlights.map((stat) => (
                      <li className="col-sm-6" key={stat.label}>
                        <div className="why-item">
                          <div className="why-icon">
                            <Icon name={toIconName(stat.icon, "star")} />
                          </div>
                          <div>
                            <strong>{formatStat(stat)}</strong>
                            <span>{stat.label}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
