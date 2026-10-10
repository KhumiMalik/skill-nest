"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Photo } from "@/lib/api/schemas";
import { ClientIcon } from "./ClientIcon";

type LightboxProps = {
  photos: Photo[];
  /** Accessible name of the dialog, e.g. "Campus photos". */
  label: string;
  index: number;
  onIndexChange: (index: number) => void;
  /** Called after the dialog closes, with the index of the photo shown last. */
  onClose: (lastIndex: number) => void;
};

/**
 * Full-screen photo viewer built on the native `<dialog>` element, which already provides what a
 * modal needs: focus moves into it, the rest of the page is inert, and Escape closes it.
 * We add Previous/Next buttons, the arrow keys and closing by clicking the dark backdrop.
 *
 * Default export so that `next/dynamic` can load it on demand (see PhotoGrid).
 */
export default function Lightbox({ photos, label, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = photos.length;
  const photo = photos[index];

  // The component is only rendered while open, so open the dialog as soon as it mounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Arrow keys move between photos. A document listener, because jsx-a11y (rightly) rejects
  // keyboard handlers on non-interactive elements such as <dialog>.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (count < 2) return;
      if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [count, index, onIndexChange]);

  // A click on the backdrop reaches the <dialog> itself; clicks on its content have another target.
  useEffect(() => {
    const dialog = dialogRef.current;
    function onClick(event: globalThis.MouseEvent) {
      if (event.target === dialog) dialog?.close();
    }
    dialog?.addEventListener("click", onClick);
    return () => dialog?.removeEventListener("click", onClick);
  }, []);

  if (!photo) return null;
  const caption = photo.caption ?? photo.title;

  return (
    <dialog ref={dialogRef} className="lightbox" aria-label={label} onClose={() => onClose(index)}>
      <button type="button" className="lightbox-close" onClick={() => dialogRef.current?.close()}>
        <ClientIcon name="x-lg" label="Close" />
      </button>
      <figure className="lightbox-figure">
        <Image
          key={photo.image.src}
          src={photo.image.src}
          alt={photo.image.alt}
          width={photo.image.width}
          height={photo.image.height}
          sizes="100vw"
          className="lightbox-img"
        />
        {/* Announced when it changes, so screen reader users hear which photo is shown. */}
        <figcaption aria-live="polite">
          {caption && <span>{caption}</span>}
          <span className="lightbox-count">
            Photo {index + 1} of {count}
          </span>
        </figcaption>
      </figure>
      {count > 1 && (
        <>
          <button
            type="button"
            className="lightbox-nav prev"
            onClick={() => onIndexChange((index - 1 + count) % count)}
          >
            <ClientIcon name="chevron-left" label="Previous photo" />
          </button>
          <button type="button" className="lightbox-nav next" onClick={() => onIndexChange((index + 1) % count)}>
            <ClientIcon name="chevron-right" label="Next photo" />
          </button>
        </>
      )}
    </dialog>
  );
}
