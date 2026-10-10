"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { type MouseEvent, useRef, useState } from "react";
import type { Photo } from "@/lib/api/schemas";

// The lightbox is only downloaded when someone opens a photo (it is not part of the page's initial JavaScript).
const Lightbox = dynamic(() => import("./Lightbox"));

type PhotoGridProps = {
  photos: Photo[];
  /** Accessible name of the lightbox, e.g. "Campus photos". */
  label: string;
  /** Bootstrap column classes of each tile, e.g. "col-lg-3 col-md-6". */
  columnClassName: string;
  /** next/image `sizes` of a tile, matching the columns. */
  sizes: string;
  /** Classes of the grid row, e.g. "row g-3". */
  rowClassName?: string;
  /**
   * How many of the first photos load straight away instead of lazily. Use it when the grid is at the
   * top of the page (an album), so its first photo, usually the Largest Contentful Paint, isn't delayed.
   */
  eagerCount?: number;
};

/**
 * Gallery tiles that open a lightbox. Each tile is a link to the full-size image, so without
 * JavaScript (or with Ctrl/Cmd+click) the image simply opens in the browser.
 */
export function PhotoGrid({
  photos,
  label,
  columnClassName,
  sizes,
  rowClassName = "row g-4",
  eagerCount = 0,
}: PhotoGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  function open(event: MouseEvent<HTMLAnchorElement>, index: number) {
    // Let the browser handle "open in new tab" clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpenIndex(index);
  }

  function close(lastIndex: number) {
    setOpenIndex(null);
    // Return focus to the tile of the photo that was shown last.
    tileRefs.current[lastIndex]?.focus();
  }

  return (
    <>
      <ul className={`${rowClassName} list-unstyled mb-0`}>
        {photos.map((photo, index) => (
          <li className={columnClassName} key={photo.image.src}>
            <a
              href={photo.image.src}
              ref={(element) => {
                tileRefs.current[index] = element;
              }}
              className="gallery-tile"
              aria-haspopup="dialog"
              onClick={(event) => open(event, index)}
            >
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                width={photo.image.width}
                height={photo.image.height}
                sizes={sizes}
                loading={index < eagerCount ? "eager" : "lazy"}
                fetchPriority={index === 0 && eagerCount > 0 ? "high" : undefined}
              />
              {photo.title && (
                <span className="overlay">
                  <span className="overlay-title">{photo.title}</span>
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <Lightbox photos={photos} label={label} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
      )}
    </>
  );
}
