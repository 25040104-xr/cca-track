// Tests for Part B: My Applications, Application Detail and Notifications,
// and for how a new application from the Apply form reaches My Applications.
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";
import { applicationData } from "./data/applications";
import { ccas } from "./data/ccas";
import { isOverdue } from "./services/applicationService";
import { findExistingApplication } from "./utils/createApplication";
import { formatDate } from "./utils/dates";

// ----- helper functions -----

test("formatDate turns YYYY-MM-DD into a readable date", () => {
  expect(formatDate("2026-12-05")).toBe("5 Dec 2026");
});

test("an application is overdue only if still waiting and past the reply date", () => {
  const app02 = applicationData.find((a) => a.id === "app-02"); // expected 17 Nov
  const app04 = applicationData.find((a) => a.id === "app-04"); // expected 21 Nov
  expect(isOverdue(app02)).toBe(true);
  expect(isOverdue(app04)).toBe(false);
});

test("findExistingApplication finds the student's application to a CCA", () => {
  // stu-01 applied to Handball (cca-02)
  expect(findExistingApplication(applicationData, "stu-01", "cca-02").id).toBe("app-02");
  // stu-01 never applied to cca-50
  expect(findExistingApplication(applicationData, "stu-01", "cca-50")).toBeUndefined();
});

// ----- pages -----

test("My Applications shows the cards, summary and overdue warning", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "My Applications" }));
  expect(screen.getByText("Total applied")).toBeInTheDocument();
  expect(screen.getByText(/application\(s\) have passed the expected reply date/)).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /View details/ })).toHaveLength(6);
});

test("filtering My Applications to Accepted shows only accepted ones", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "My Applications" }));
  fireEvent.click(screen.getByRole("button", { name: "Accepted" }));
  expect(screen.getAllByRole("button", { name: /View details/ })).toHaveLength(1);
  expect(screen.getByText("Chinese Ensemble")).toBeInTheDocument();
});

test("withdrawing an application updates its status", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "My Applications" }));
  fireEvent.click(screen.getByRole("button", { name: "In progress" }));
  fireEvent.click(screen.getAllByRole("button", { name: /View details/ })[0]);
  fireEvent.click(screen.getByRole("button", { name: "Withdraw application" }));
  fireEvent.click(screen.getByRole("button", { name: "Yes, withdraw" }));
  expect(screen.getByText(/You have withdrawn your application/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Withdraw application" })).not.toBeInTheDocument();
});

test("marking all notifications as read removes the navbar badge", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
  expect(screen.getByText("You have 2 unread update(s).")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mark all as read" }));
  expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
  expect(screen.queryByLabelText(/unread/)).not.toBeInTheDocument();
});

// ----- the full flow: apply -> My Applications -> Notifications -----

function openApplyForm(ccaName) {
  const card = screen.getByRole("heading", { name: ccaName }).closest(".cca-card");
  fireEvent.click(within(card).getByRole("button", { name: /View details/ }));
  fireEvent.click(screen.getByRole("button", { name: "Apply now" }));
}

test("a new application appears in My Applications and Notifications", () => {
  render(<App />);
  openApplyForm(getFreeCCAName());

  fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "98765432" } });
  fireEvent.change(screen.getByLabelText("Experience level"), { target: { value: "none" } });
  fireEvent.change(screen.getByLabelText("Why do you want to join?"), {
    target: { value: "I want to make new friends and try something new." },
  });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Submit application" }));

  expect(screen.getByText("✅ Application submitted!")).toBeInTheDocument();

  // Now 7 applications and 3 unread notifications
  fireEvent.click(screen.getByRole("button", { name: "My Applications" }));
  expect(screen.getAllByRole("button", { name: /View details/ })).toHaveLength(7);
  expect(screen.getByLabelText("3 unread")).toBeInTheDocument();
});

test("the CCA page shows 'Already applied' instead of Apply now", () => {
  render(<App />);
  const card = screen.getByRole("heading", { name: "Handball" }).closest(".cca-card");
  fireEvent.click(within(card).getByRole("button", { name: /View details/ }));
  // stu-01 already applied to Handball (app-02)
  expect(screen.getByRole("button", { name: /Already applied/ })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Apply now" })).not.toBeInTheDocument();
});

// A CCA that stu-01 has never applied to (the first one in the directory that is free)
function getFreeCCAName() {
  const appliedIds = applicationData.filter((a) => a.studentId === "stu-01").map((a) => a.ccaId);
  return ccas.find((c) => !appliedIds.includes(c.id)).name;
}
