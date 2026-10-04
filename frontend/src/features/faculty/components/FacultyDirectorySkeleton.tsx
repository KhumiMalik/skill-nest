import type { ReactNode } from "react";

type FacultyDirectorySkeletonProps = {
  /**
   * Shown instead of the skeleton when JavaScript is off. Streamed Suspense content needs a
   * small inline script to appear, so without JavaScript the directory would never replace this.
   */
  noScriptFallback?: ReactNode;
};

/** Placeholder with the directory's layout, shown while the filtered results stream in. */
export function FacultyDirectorySkeleton({ noScriptFallback }: FacultyDirectorySkeletonProps) {
  return (
    <>
      {noScriptFallback && (
        <noscript>
          <style>{".directory-skeleton { display: none; }"}</style>
          {noScriptFallback}
        </noscript>
      )}
      <div className="row g-4 directory-skeleton">
        <p className="visually-hidden" role="status">
          Loading the staff directory
        </p>
        <div className="col-lg-3" aria-hidden="true">
          <div className="sidebar-box">
            <div className="skeleton skeleton-line w-50" />
            <div className="skeleton skeleton-input" />
          </div>
          <div className="sidebar-box">
            <div className="skeleton skeleton-line w-50" />
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="skeleton skeleton-line" />
            ))}
          </div>
        </div>
        <div className="col-lg-9" aria-hidden="true">
          <div className="skeleton skeleton-line w-25 mb-4" />
          <div className="row g-4">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="skeleton skeleton-card" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
