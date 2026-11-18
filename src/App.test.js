import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("opens on the Explore CCAs page with the navbar", () => {
  render(<App />);
  expect(screen.getByText("ccaTrack.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Explore CCAs/ })).toBeInTheDocument();
});

test("shows the number of unread notifications in the navbar", () => {
  render(<App />);
  // stu-01 has 2 unread notifications in the mock data
  expect(screen.getByLabelText("2 unread")).toBeInTheDocument();
});

test("switching to the Exco view shows the exco links", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("combobox", { name: /View as/ }), { target: { value: "exco" } });
  expect(screen.getByRole("button", { name: "Applicants" })).toBeInTheDocument();
});
