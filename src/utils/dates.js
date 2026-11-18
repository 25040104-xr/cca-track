// For the CA1 prototype we fix "today" so the demo always looks the same.
// In CA2 this will be the real date.
export const TODAY = "2026-11-18";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Changes "2026-11-03" into "3 Nov 2026"
export function formatDate(date) {
  const parts = date.split("-"); // ["2026", "11", "03"]
  const year = parts[0];
  const month = MONTHS[Number(parts[1]) - 1];
  const day = Number(parts[2]);
  return day + " " + month + " " + year;
}

// Adds some days to a date, e.g. addDays("2026-11-18", 7) gives "2026-11-25"
export function addDays(date, days) {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}
