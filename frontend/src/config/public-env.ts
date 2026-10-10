/**
 * Public environment variables. These are inlined into the browser bundle at build time,
 * so each one must be read as a literal `process.env.NEXT_PUBLIC_*` expression.
 *
 * Validated by hand rather than with Zod: this file reaches the browser (the header imports the
 * site config), and Zod would add about 90 KB of JavaScript to every page.
 */
function parseSiteUrl(value: string | undefined): string {
  const url = value || "http://localhost:3000";
  if (!URL.canParse(url) || !/^https?:$/.test(new URL(url).protocol)) {
    throw new Error(`Invalid public environment variable NEXT_PUBLIC_SITE_URL: "${url}" is not an http(s) URL.`);
  }
  return url;
}

export const publicEnv = {
  NEXT_PUBLIC_SITE_URL: parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
};
