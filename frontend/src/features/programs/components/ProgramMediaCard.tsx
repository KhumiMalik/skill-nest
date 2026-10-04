import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { ProgramSummary } from "../types";

/** Image-on-top card used in the programs grid. */
export function ProgramMediaCard({ program }: { program: ProgramSummary }) {
  return (
    <article className="media-card">
      <div className="media-img">
        <Image
          src={program.image.src}
          alt={program.image.alt}
          width={program.image.width}
          height={program.image.height}
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
        />
      </div>
      <div className="media-body">
        <h3>
          <Link href={`/programs/${program.slug}`}>{program.title}</Link>
        </h3>
        <p>{program.summary}</p>
        <ul className="media-footer list-unstyled mb-0">
          <li>
            <Icon name="person" /> {program.ageRange}
          </li>
          <li>
            <Icon name="clock" /> {program.duration}
          </li>
        </ul>
      </div>
    </article>
  );
}
