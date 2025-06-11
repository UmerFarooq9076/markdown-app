import { render, screen, fireEvent } from "@testing-library/react";
import { SlideRenderer } from "./SlideRenderer";

test("toggles edit and view mode", () => {
  render(<SlideRenderer content="Hello" onChange={() => {}} />);

  const toggleBtn = screen.getByRole("button", { name: /Edit Slide/i });
  fireEvent.click(toggleBtn);

  expect(screen.getByRole("textbox")).toBeInTheDocument();

  fireEvent.click(toggleBtn);
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});

test("bold button wraps selected text with **", () => {
  const update = jest.fn();
  render(<SlideRenderer content="Test" onChange={update} />);

  fireEvent.click(screen.getByRole("button", { name: /Edit Slide/i }));

  const textarea: any = screen.getByRole("textbox");

  textarea.setSelectionRange(0, 4);
  fireEvent.click(screen.getByRole("button", { name: "B" }));

  expect(update).toHaveBeenCalledWith("**Test**");
});
