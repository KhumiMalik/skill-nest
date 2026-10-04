import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { FacultySummary } from "../types";

export function PersonCard({ person }: { person: FacultySummary }) {
  return (
    <article className="person-card">
      <Image
        src={person.photo.src}
        alt=""
        width={person.photo.width}
        height={person.photo.height}
        sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw"
      />
      <div className="person-info">
        <h3>
          <Link href={`/faculty/${person.slug}`}>{person.name}</Link>
        </h3>
        <span className="role">{person.role}</span>
        <p>{person.shortBio}</p>
        {person.email && (
          <ul className="social-links list-unstyled mb-0">
            <li>
              <a href={`mailto:${person.email}`}>
                <Icon name="envelope" label={`Email ${person.name}`} />
              </a>
            </li>
          </ul>
        )}
      </div>
    </article>
  );
}
