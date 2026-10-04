import Image from "next/image";
import { Icon, toIconName } from "@/components/ui/Icon";
import type { HomePage, IconCard } from "../types";
import { StatValue } from "./StatValue";

type WelcomeSectionProps = { welcome: HomePage["welcome"]; pillars: IconCard[] };

/** Home page introduction: welcome text, key figures, the Head's signature and mission/vision/values. */
export function WelcomeSection({ welcome, pillars }: WelcomeSectionProps) {
  const [backImage, frontImage] = welcome.images;

  return (
    <section id="about" className="section about-home">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6 reveal">
            <h2>
              {welcome.title} <span className="text-primary-theme">{welcome.titleHighlight}</span>
            </h2>
            <p className="lead-text">{welcome.lead}</p>
            <ul className="about-stats list-unstyled">
              {welcome.stats.map((stat) => (
                <li className="about-stat" key={stat.label}>
                  <strong>
                    <StatValue stat={stat} />
                  </strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
            <div className="signature-row">
              {/* The handwritten name is decoration; the printed name next to it is what assistive tech reads. */}
              <span className="signature" aria-hidden="true">
                {welcome.signature.name}
              </span>
              <div>
                <strong>{welcome.signature.name}</strong>
                <span>{welcome.signature.role}</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6 reveal">
            <div className="img-stack">
              <Image
                src={backImage.src}
                alt={backImage.alt}
                width={backImage.width}
                height={backImage.height}
                sizes="(max-width: 991px) 80vw, 40vw"
                className="img-back"
              />
              <Image
                src={frontImage.src}
                alt={frontImage.alt}
                width={frontImage.width}
                height={frontImage.height}
                sizes="(max-width: 991px) 80vw, 40vw"
                className="img-front"
              />
            </div>
          </div>
        </div>

        <ul className="row g-4 mt-5 pt-4 list-unstyled">
          {pillars.map((pillar, index) => (
            <li className="col-lg-4 reveal" key={pillar.title}>
              <div className={index === pillars.length - 1 ? "info-card featured" : "info-card"}>
                <div className="icon-round">
                  <Icon name={toIconName(pillar.icon, "star")} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
