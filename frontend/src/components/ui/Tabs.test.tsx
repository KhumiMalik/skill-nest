import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "primary", label: "Primary", panel: <p>Primary programs</p> },
  { id: "secondary", label: "Secondary", panel: <p>Secondary programs</p> },
  { id: "sixth-form", label: "Sixth Form", panel: <p>Sixth Form programs</p> },
];

describe("Tabs", () => {
  it("shows the first panel and links tabs to panels", () => {
    render(<Tabs label="Programs by stage" tabs={tabs} />);
    const first = screen.getByRole("tab", { name: "Primary" });
    expect(screen.getByRole("tablist", { name: "Programs by stage" })).toBeInTheDocument();
    expect(first).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Primary" })).toHaveTextContent("Primary programs");
    expect(screen.queryByText("Secondary programs")).not.toBeVisible();
  });

  it("has a single tab stop", () => {
    render(<Tabs label="Programs by stage" tabs={tabs} />);
    const [first, ...others] = screen.getAllByRole("tab");
    expect(first).toHaveAttribute("tabindex", "0");
    for (const tab of others) expect(tab).toHaveAttribute("tabindex", "-1");
  });

  it("moves selection and focus with the arrow keys, Home and End", async () => {
    const user = userEvent.setup();
    render(<Tabs label="Programs by stage" tabs={tabs} />);
    await user.click(screen.getByRole("tab", { name: "Primary" }));

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Secondary" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Secondary" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Secondary programs")).toBeVisible();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Sixth Form" })).toHaveFocus();

    await user.keyboard("{ArrowRight}"); // wraps around
    expect(screen.getByRole("tab", { name: "Primary" })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Sixth Form" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Primary" })).toHaveAttribute("aria-selected", "true");
  });
});
