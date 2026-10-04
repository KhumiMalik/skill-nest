import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PROGRAM_LEVEL_LABELS } from "../schemas";
import type { ProgramSummary } from "../types";

/** Wide card with the image on the left (home page "Featured Programs"). */
export function ProgramCard({ program }: { program: ProgramSummary }) {
  return (
    <article className="program-card">
      <div className="program-img">
        <Image
          src={program.image.src}
          alt={program.image.alt}
          width={program.image.width}
          height={program.image.height}
          sizes="(max-width: 575px) 100vw, 220px"
        />
      </div>
      <div className="program-body">
        <div className="program-head">
          <h3>{program.title}</h3>
          <span className="program-badge">{PROGRAM_LEVEL_LABELS[program.level]}</span>
        </div>
        <ul className="program-meta list-unstyled">
          <li>
            <Icon name="person" />
            {program.ageRange}
          </li>
          <li>
            <Icon name="clock" />
            {program.duration}
          </li>
          <li>
            <Icon name="people-fill" />
            {program.classSize}
          </li>
        </ul>
        <p>{program.summary}</p>
        <Link href={`/programs/${program.slug}`} className="link-arrow">
          Learn More<span className="visually-hidden"> about {program.title}</span> <Icon name="arrow-right" />
        </Link>
      </div>
    </article>
  );
}
