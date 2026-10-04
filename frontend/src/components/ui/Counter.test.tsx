import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("renders the final, formatted value (no animation without IntersectionObserver)", () => {
    render(<Counter value={1240} suffix="+" />);
    // Once for screen readers, once (aria-hidden) for the animated digits.
    expect(screen.getAllByText("1,240+")).toHaveLength(2);
  });
});
