import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { facultyHref } from "../filters";
import type { FacultyMember } from "../types";

export function FacultyProfile({ member }: { member: FacultyMember }) {
  return (
    <section className="section">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="profile-card">
              <Image
                src={member.photo.src}
                alt={member.photo.alt}
                width={member.photo.width}
                height={member.photo.height}
                sizes="(max-width: 991px) 100vw, 360px"
                preload
              />
              <div className="profile-body">
                <p className="role">{member.role}</p>
                <dl className="facts-list">
                  <div>
                    <dt>
                      <Icon name="diagram-3" /> Department
                    </dt>
                    <dd>
                      <Link href={facultyHref({ department: member.department.slug })}>{member.department.name}</Link>
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <Icon name="calendar-event" /> Joined Greenfield
                    </dt>
                    <dd>{member.joinedYear}</dd>
                  </div>
                  {member.email && (
                    <div>
                      <dt>
                        <Icon name="envelope" /> Email
                      </dt>
                      <dd className="text-break">
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          <article className="col-lg-8">
            <div className="article">
              <h2 className="mt-0">Biography</h2>
              {member.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {member.qualifications.length > 0 && (
                <>
                  <h2>Qualifications</h2>
                  <ul className="check-list">
                    {member.qualifications.map((qualification) => (
                      <li key={qualification}>{qualification}</li>
                    ))}
                  </ul>
                </>
              )}

              {member.subjects.length > 0 && (
                <>
                  <h2>Teaches</h2>
                  <ul className="tag-list">
                    {member.subjects.map((subject) => (
                      <li key={subject}>
                        <span>{subject}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <Link href="/faculty" className="link-arrow mt-4">
                <Icon name="arrow-left" /> Back to the staff directory
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
