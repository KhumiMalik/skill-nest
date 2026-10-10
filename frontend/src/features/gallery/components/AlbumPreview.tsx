import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Album } from "../types";

type AlbumPreviewProps = { album: Album; title: string; subtitle?: string; limit?: number };

/** The first few photos of an album on another page (e.g. "Campus Gallery" on /campus). */
export function AlbumPreview({ album, title, subtitle, limit = 4 }: AlbumPreviewProps) {
  if (album.photos.length === 0) return null;

  return (
    <section id="gallery" className="section">
      <div className="container">
        <SectionTitle title={title} subtitle={subtitle} />
        <div className="reveal">
          <PhotoGrid
            photos={album.photos.slice(0, limit)}
            label={album.title}
            columnClassName="col-lg-3 col-md-6"
            sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw"
          />
        </div>
        <p className="mt-4 text-center">
          <Link href={`/gallery/${album.slug}`} className="link-arrow">
            See all {album.photos.length} photos <Icon name="arrow-right" />
          </Link>
        </p>
      </div>
    </section>
  );
}
