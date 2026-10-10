import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { formatDay } from "@/lib/dates";
import type { Album } from "../types";

/** An album page: description, photo grid with lightbox, and a link back to all albums. */
export function AlbumView({ album }: { album: Album }) {
  return (
    <section className="section">
      <div className="container">
        <div className="album-intro reveal">
          <p className="album-meta">
            <time dateTime={album.date}>{formatDay(album.date)}</time> &middot; {album.photos.length} photos
          </p>
          <p>{album.description}</p>
        </div>
        <h2 className="visually-hidden">Photos</h2>
        {album.photos.length > 0 ? (
          <PhotoGrid
            photos={album.photos}
            label={album.title}
            columnClassName="col-lg-4 col-sm-6"
            eagerCount={3}
            sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"
          />
        ) : (
          <p className="text-center">Photos for this album are coming soon.</p>
        )}
        <p className="mt-5 text-center">
          <Link href="/gallery" className="btn-outline-main">
            <Icon name="arrow-left" /> All albums
          </Link>
        </p>
      </div>
    </section>
  );
}
