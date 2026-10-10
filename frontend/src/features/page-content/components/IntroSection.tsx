import Image from "next/image";
import { Icon, type IconName, toIconName } from "@/components/ui/Icon";
import type { ApiImage } from "@/lib/api/schemas";
import type { IconCard, PageIntro } from "../types";
import { StatValue } from "./StatValue";

/** Opening text of an inner page with three key figures beside it (campus, student life). */
export function IntroWithStats({ intro }: { intro: PageIntro }) {
  return (
    <div className="row align-items-center gy-5 mb-5">
      <div className="col-lg-7 reveal">
        <span className="eyebrow">{intro.eyebrow}</span>
        <h2 className="mb-3">{intro.title}</h2>
        {intro.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="col-lg-5 reveal">
        <ul className="row text-center list-unstyled mb-0">
          {intro.stats.map((stat) => (
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
    </div>
  );
}

type IconCardListProps = {
  cards: IconCard[];
  /** Shown when a card's icon name is unknown. */
  fallbackIcon: IconName;
  columnClassName?: string;
};

/** A row of white cards with an icon, title and text. Every second icon uses the accent colour, as in the template. */
export function IconCardList({ cards, fallbackIcon, columnClassName = "col-md-6 col-lg-3" }: IconCardListProps) {
  return (
    <ul className="row g-4 list-unstyled mb-0">
      {cards.map((card, index) => (
        <li className={`${columnClassName} reveal`} key={card.title}>
          <div className="card-box">
            <div className={index % 2 === 1 ? "icon-circle accent" : "icon-circle"}>
              <Icon name={toIconName(card.icon, fallbackIcon)} />
            </div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A rounded image in a content column. */
export function ContentImage({ image, sizes }: { image: ApiImage; sizes: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      className="rounded-img"
    />
  );
}
