import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Carousel } from "./Carousel";

const image = (n: number) => ({
  src: `https://placehold.co/1000x650/png?text=${n}`,
  alt: `Photo ${n}`,
  width: 1000,
  height: 650,
});

describe("Carousel", () => {
  it("shows one slide at a time and moves with the Previous/Next buttons", async () => {
    const user = userEvent.setup();
    render(<Carousel images={[image(1), image(2), image(3)]} label="Science photos" sizes="100vw" />);

    expect(screen.getByRole("region", { name: "Science photos" })).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("img", { name: "Photo 1" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Photo 2", hidden: true })).not.toBeVisible();

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByRole("img", { name: "Photo 2" })).toBeVisible();
    expect(screen.getByRole("group", { name: "2 of 3" })).toBeVisible();

    // Wraps around in both directions.
    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(screen.getByRole("img", { name: "Photo 3" })).toBeVisible();
  });

  it("can be paused and restarted", async () => {
    const user = userEvent.setup();
    render(<Carousel images={[image(1), image(2)]} label="Photos" sizes="100vw" />);

    // The test environment doesn't prefer reduced motion, so the slide show starts playing.
    await user.click(screen.getByRole("button", { name: "Stop automatic slide show" }));
    expect(screen.getByRole("button", { name: "Start automatic slide show" })).toBeInTheDocument();
  });

  it("has no controls for a single image", () => {
    render(<Carousel images={[image(1)]} label="Photos" sizes="100vw" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
