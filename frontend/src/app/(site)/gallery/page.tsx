import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { AlbumGrid, getAlbums } from "@/features/gallery";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: "Photo albums from school events, performances, sport, trips and our campus at Greenfield Academy.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <>
      <PageBanner title="Gallery" description="Moments from school life, captured by staff and pupils." />
      <section className="section">
        <div className="container">
          <AlbumGrid albums={albums} />
        </div>
      </section>
    </>
  );
}
