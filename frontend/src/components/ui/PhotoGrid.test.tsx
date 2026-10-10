import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PhotoGrid } from "./PhotoGrid";

const photos = [1, 2, 3].map((n) => ({
  image: { src: `https://placehold.co/1400x1000/png?text=${n}`, alt: `Photo ${n}`, width: 1400, height: 1000 },
  caption: `Caption ${n}`,
}));

function renderGrid() {
  render(<PhotoGrid photos={photos} label="Sports Day" columnClassName="col-4" sizes="33vw" />);
}

describe("PhotoGrid", () => {
  it("links each tile to the full-size image, so it works without JavaScript", () => {
    renderGrid();
    expect(screen.getByRole("link", { name: "Photo 2" })).toHaveAttribute("href", photos[1]?.image.src);
  });

  it("opens the photo in a lightbox and moves with the buttons and arrow keys", async () => {
    const user = userEvent.setup();
    renderGrid();

    await user.click(screen.getByRole("link", { name: "Photo 2" }));
    const dialog = await screen.findByRole("dialog", { name: "Sports Day" });
    expect(dialog).toHaveTextContent("Caption 2");
    expect(dialog).toHaveTextContent("Photo 2 of 3");

    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(dialog).toHaveTextContent("Photo 3 of 3");
    await user.keyboard("{ArrowRight}");
    expect(dialog).toHaveTextContent("Photo 1 of 3");
    await user.keyboard("{ArrowLeft}");
    expect(dialog).toHaveTextContent("Photo 3 of 3");
  });

  it("closes and returns focus to the tile of the photo shown last", async () => {
    const user = userEvent.setup();
    renderGrid();

    await user.click(screen.getByRole("link", { name: "Photo 1" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Next photo" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Photo 2" })).toHaveFocus();
  });
});
