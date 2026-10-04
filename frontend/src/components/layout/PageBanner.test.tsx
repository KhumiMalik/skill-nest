import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageBanner } from "./PageBanner";

describe("PageBanner", () => {
  it("renders the title as the page's h1", () => {
    render(<PageBanner title="Admissions" />);
    expect(screen.getByRole("heading", { level: 1, name: "Admissions" })).toBeInTheDocument();
  });

  it("links every breadcrumb except the current page", () => {
    render(<PageBanner title="Open Day" breadcrumbs={[{ label: "Events", href: "/events" }, { label: "Open Day" }]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toContainElement(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("link", { name: "Events" })).toHaveAttribute("href", "/events");
    expect(screen.queryByRole("link", { name: "Open Day" })).not.toBeInTheDocument();
    expect(screen.getByText("Open Day", { selector: "[aria-current='page']" })).toBeInTheDocument();
  });
});
