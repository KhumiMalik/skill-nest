import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { AlbumPreview, getAlbum } from "@/features/gallery";
import { CampusFacilities, CampusMap, getCampusPage } from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Campus & Facilities",
  description:
    "Explore Greenfield Academy's forty-acre campus: the Science & Innovation Centre, library, theatre, sports centre, pool and playing fields.",
  path: "/campus",
});

export default async function CampusPage() {
  const page = await getCampusPage();
  const album = await getAlbum(page.galleryAlbum);

  return (
    <>
      <PageBanner
        title="Campus & Facilities"
        description="Inspiring spaces for learning, creativity and sport, set in forty acres of green space."
      />
      <CampusFacilities page={page} />
      <CampusMap map={page.map} />
      {album && (
        <AlbumPreview
          album={album}
          title="Campus Gallery"
          subtitle="A walk around the school, from the Main House to the forest school."
        />
      )}
    </>
  );
}
