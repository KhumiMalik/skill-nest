import Image from "next/image";
import type { ContentBlock } from "@/lib/api/schemas";
import { Icon } from "./Icon";

/** "Getting there & parking!" -> "getting-there-parking" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The id of every heading block, in order, made unique ("results", "results-2"). */
export function getHeadings(blocks: ContentBlock[]): { id: string; text: string }[] {
  const seen = new Map<string, number>();
  return blocks.flatMap((block) => {
    if (block.type !== "heading") return [];
    const base = slugify(block.text) || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return { id: count === 1 ? base : `${base}-${count}`, text: block.text };
  });
}

/** Renders API content blocks with our own markup and styles (see contentBlockSchema). */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  const headings = getHeadings(blocks);
  let headingIndex = 0;

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "heading": {
            const heading = headings[headingIndex++];
            return (
              <h2 key={index} id={heading?.id}>
                {block.text}
              </h2>
            );
          }
          case "list":
            return (
              <ul key={index} className="check-list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <figure key={index} className="content-quote">
                <blockquote>{block.text}</blockquote>
                {block.cite && <figcaption>{block.cite}</figcaption>}
              </figure>
            );
          case "image":
            return (
              <figure key={index} className="content-image">
                <Image
                  src={block.image.src}
                  alt={block.image.alt}
                  width={block.image.width}
                  height={block.image.height}
                  sizes="(max-width: 991px) 100vw, 760px"
                  className="rounded-img"
                />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          case "callout":
            return (
              <aside key={index} className="info-box" aria-label={block.title}>
                <Icon name="info-circle" />
                <div>
                  <p className="info-box-title">{block.title}</p>
                  <p className="mb-0">{block.text}</p>
                </div>
              </aside>
            );
        }
      })}
    </>
  );
}

/** Links to the article's headings. Only shown for longer articles (three or more sections). */
export function TableOfContents({ blocks }: { blocks: ContentBlock[] }) {
  const headings = getHeadings(blocks);
  if (headings.length < 3) return null;

  return (
    <nav className="toc" aria-labelledby="toc-title">
      <h2 id="toc-title">Contents</h2>
      <ol>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Rough reading time at 200 words per minute, at least one minute. */
export function readingMinutes(blocks: ContentBlock[]): number {
  const text = blocks
    .map((block) => {
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "image") return block.caption ?? "";
      if (block.type === "callout") return `${block.title} ${block.text}`;
      return block.text;
    })
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** The blocks as plain text paragraphs (e.g. for a JobPosting description in structured data). */
export function contentBlocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
        case "heading":
        case "quote":
          return block.text;
        case "list":
          return block.items.map((item) => `- ${item}`).join("\n");
        case "callout":
          return `${block.title}: ${block.text}`;
        case "image":
          return block.caption ?? "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}
