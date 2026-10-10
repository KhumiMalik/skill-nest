import { formatFileSize } from "@/lib/format";
import type { ApiFile } from "@/lib/api/schemas";
import { Icon } from "./Icon";

/**
 * Download links for documents (application forms, fee schedules...). The link text includes the
 * format and size, so people know what they are about to download.
 */
export function FileList({ files }: { files: ApiFile[] }) {
  if (files.length === 0) return null;

  return (
    <ul className="file-list list-unstyled">
      {files.map((file) => (
        <li key={file.url}>
          <a href={file.url} className="file-link">
            <span className="icon-circle">
              <Icon name="file-earmark-pdf" />
            </span>
            <span className="file-text">
              <span className="file-title">{file.title}</span>
              {file.description && <span className="file-description">{file.description}</span>}
              <span className="file-meta">
                {file.format}, {formatFileSize(file.sizeBytes)}
              </span>
            </span>
            <Icon name="download" className="file-download" />
          </a>
        </li>
      ))}
    </ul>
  );
}
