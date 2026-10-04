import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getPageItems, Pagination } from "./Pagination";

describe("getPageItems", () => {
  it("lists every page when there are few", () => {
    expect(getPageItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("collapses long ranges around the current page", () => {
    expect(getPageItems(1, 9)).toEqual([1, 2, "gap", 9]);
    expect(getPageItems(5, 9)).toEqual([1, "gap", 4, 5, 6, "gap", 9]);
    // A gap of a single page shows that page instead of an ellipsis.
    expect(getPageItems(3, 9)).toEqual([1, 2, 3, 4, "gap", 9]);
  });
});

describe("Pagination", () => {
  const hrefForPage = (page: number) => `/faculty?page=${page}`;

  it("renders nothing for a single page", () => {
    const { container } = render(<Pagination page={1} totalPages={1} hrefForPage={hrefForPage} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page and links to the neighbours", () => {
    render(<Pagination page={2} totalPages={3} hrefForPage={hrefForPage} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Previous page" })).toHaveAttribute("href", "/faculty?page=1");
    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute("href", "/faculty?page=3");
  });

  it("hides the previous link on the first page and next on the last", () => {
    const { rerender } = render(<Pagination page={1} totalPages={3} hrefForPage={hrefForPage} />);
    expect(screen.queryByRole("link", { name: "Previous page" })).not.toBeInTheDocument();
    rerender(<Pagination page={3} totalPages={3} hrefForPage={hrefForPage} />);
    expect(screen.queryByRole("link", { name: "Next page" })).not.toBeInTheDocument();
  });
});
