import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { NavItem } from "@/config/site";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({ usePathname: () => "/admissions" }));

const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Admissions", href: "/admissions" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

describe("Header", () => {
  it("toggles a dropdown with its button and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(<Header siteName="Greenfield Academy" nav={nav} />);

    const toggle = screen.getByRole("button", { name: "About" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("marks the current page and its parent menu", () => {
    render(<Header siteName="Greenfield Academy" nav={nav} />);
    expect(screen.getByRole("link", { name: "Admissions" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "About" })).toHaveClass("active");
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(<Header siteName="Greenfield Academy" nav={nav} />);

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(menuButton).toHaveAccessibleName("Close menu");

    await user.keyboard("{Escape}");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
