import Image from "next/image";
import Link from "next/link";
import { Icon, toIconName } from "@/components/ui/Icon";
import type { HomePage } from "../types";
import { StatValue } from "./StatValue";

export function AchievementsSection({ achievements }: { achievements: HomePage["achievements"] }) {
  return (
    <section id="stats" className="section">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6 stats-intro reveal">
            <h2>{achievements.title}</h2>
            <p>{achievements.text}</p>
            <div className="d-flex flex-wrap gap-3">
              <Link href="/about" className="btn-main">
                Learn More<span className="visually-hidden"> about Greenfield</span>
              </Link>
              <Link href="/campus" className="btn-outline-main">
                Explore the Campus
              </Link>
            </div>
          </div>
          <div className="col-lg-6 reveal">
            <ul className="row g-4 list-unstyled mb-0">
              {achievements.stats.map((stat) => (
                <li className="col-sm-6" key={stat.label}>
                  <div className="stat-card">
                    <Icon name={toIconName(stat.icon, "award")} />
                    <strong>
                      <StatValue stat={stat} />
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {achievements.links.length > 0 && (
          <ul className="row g-4 mt-5 pt-4 list-unstyled">
            {achievements.links.map((link) => (
              <li className="col-lg-4 reveal" key={link.href}>
                <Link href={link.href} className="overlay-card">
                  <Image
                    src={link.image.src}
                    alt=""
                    width={link.image.width}
                    height={link.image.height}
                    sizes="(max-width: 991px) 100vw, 33vw"
                  />
                  <div className="overlay-text">
                    <h3>{link.title}</h3>
                    <p>{link.text}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
