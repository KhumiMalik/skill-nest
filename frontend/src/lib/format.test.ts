import { describe, expect, it } from "vitest";
import { formatCurrency, formatFileSize } from "./format";

describe("formatCurrency", () => {
  it("formats whole pounds with thousands separators", () => {
    expect(formatCurrency(6450)).toBe("£6,450");
  });
});

describe("formatFileSize", () => {
  it("picks a readable unit", () => {
    expect(formatFileSize(900)).toBe("900 bytes");
    expect(formatFileSize(245760)).toBe("240 KB");
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });
});
