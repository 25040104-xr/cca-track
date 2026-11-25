// Mock data: trial sessions / interviews that CCAs hold for applicants.
// - ccaId uses the ids in ccas.js (e.g. "cca-02" = Handball)
// - dates are written as "YYYY-MM-DD"
// In CA2 this becomes the TrialSession table in the database.
export const trialSessionData = [
  { id: "trial-01", ccaId: "cca-02", date: "2026-11-27", time: "6:30pm", venue: "Sports Hall" },
  { id: "trial-02", ccaId: "cca-02", date: "2026-12-02", time: "6:30pm", venue: "Sports Hall" },
  { id: "trial-03", ccaId: "cca-01", date: "2026-11-26", time: "6:00pm", venue: "Music Room" },
  { id: "trial-04", ccaId: "cca-03", date: "2026-11-24", time: "5:00pm", venue: "Student Lounge" },
  { id: "trial-05", ccaId: "cca-03", date: "2026-12-01", time: "5:00pm", venue: "Student Lounge" },
];