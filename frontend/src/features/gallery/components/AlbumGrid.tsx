import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatDay } from "@/lib/dates";
import type { AlbumSummary } from "../types";

/** Album cards on /gallery. */
export function AlbumGrid({ albums }: { albums: AlbumSummary[] }) {
  if (albums.length === 0) return <p className="text-center">There are no photo albums yet.</p>;

  return (
    <ul className="row g-4 list-unstyled mb-0">
      {albums.map((album) => (
        <li className="col-lg-4 col-md-6 reveal" key={album.slug}>
          <article className="media-card album-card">
            <div className="media-img">
              <Image
                src={album.cover.src}
                alt=""
                width={album.cover.width}
                height={album.cover.height}
                sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
              />
              <span className="photo-count">
                <Icon name="images" /> {album.photoCount} photos
              </span>
            </div>
            <div className="media-body">
              <h2 className="h3">
                {/* The whole card is clickable (stretched link); the title is the link text. */}
                <Link href={`/gallery/${album.slug}`} className="stretched-link">
                  {album.title}
                </Link>
              </h2>
              <p>{album.description}</p>
              <p className="media-footer mb-0">
                <span>
                  <Icon name="calendar3" /> <time dateTime={album.date}>{formatDay(album.date)}</time>
                </span>
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
