"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";

/**
 * Last-resort boundary for errors in the root layout itself. It replaces the whole
 * document, so it renders its own <html> and <body> and uses inline styles only.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "80px 16px", color: "#273d4e" }}
      >
        <h1>Something went wrong</h1>
        <p>Please try again. If the problem continues, contact the school office.</p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            padding: "12px 28px",
            background: "#0c7f56",
            color: "#fff",
            border: 0,
            borderRadius: 6,
            fontWeight: 700,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
