import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { AlbumView, getAlbum, getAlbums } from "@/features/gallery";
import { pageMetadata } from "@/lib/seo/metadata";

/** A "blocking route", like the other detail pages (see docs/architecture.md). */
export const instant = false;

/** Prerender every album at build time; albums added later render on their first visit. */
export async function generateStaticParams() {
  const albums = await getAlbums();
  return albums.map((album) => ({ album: album.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gallery/[album]">): Promise<Metadata> {
  const album = await getAlbum((await params).album);
  if (!album) return { title: "Album not found" };
  return pageMetadata({ title: album.title, description: album.description, path: `/gallery/${album.slug}` });
}

export default async function AlbumPage({ params }: PageProps<"/gallery/[album]">) {
  const album = await getAlbum((await params).album);
  if (!album) notFound();

  return (
    <>
      <PageBanner title={album.title} breadcrumbs={[{ label: "Gallery", href: "/gallery" }, { label: album.title }]} />
      <AlbumView album={album} />
    </>
  );
}
