import Image from "next/image";
import Link from "next/link";
import { Icon, toIconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { HomePage } from "../types";

export function StudentLifeSection({ studentLife }: { studentLife: HomePage["studentLife"] }) {
  const { feature, cards } = studentLife;

  return (
    <section id="students-life-block" className="section">
      <div className="container">
        <SectionTitle
          title="Student Life"
          subtitle="Friendships, teams, performances and adventures: life at Greenfield goes well beyond lessons."
        />
        <div className="row g-4">
          <div className="col-lg-6 reveal">
            <Link href="/student-life" className="life-feature">
              <Image src={feature.image.src} alt="" fill sizes="(max-width: 991px) 100vw, 50vw" />
              <div className="life-caption">
                <h3>{feature.title}</h3>
                <span className="link-arrow">
                  Explore More <Icon name="arrow-right" />
                </span>
              </div>
            </Link>
          </div>
          <div className="col-lg-6 d-flex flex-column justify-content-center reveal">
            <ul className="row g-4 list-unstyled mb-0">
              {cards.map((card, index) => (
                <li className="col-md-6" key={card.title}>
                  <div className={index === 0 ? "life-card active" : "life-card"}>
                    <div className="icon-round">
                      <Icon name={toIconName(card.icon, "star")} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/student-life" className="btn-soft">
                View All Student Activities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
