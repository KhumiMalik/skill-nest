import { siteConfig } from "@/config/site";

const currencyFormat = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

/** Whole amounts in the school's currency, e.g. 6450 -> "£6,450". */
export function formatCurrency(amount: number): string {
  return currencyFormat.format(amount);
}

/** File size for download links, e.g. 245760 -> "240 KB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
