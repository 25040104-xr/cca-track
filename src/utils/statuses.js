// The text shown for each status.
// The key (e.g. "trial-scheduled") is what we save in the data,
// and it is also used as the CSS class, e.g. "status-trial-scheduled".
export const STATUS_LABELS = {
  "applied": "Applied",
  "trial-scheduled": "Trial Scheduled",
  "trial-done": "Trial Done",
  "accepted": "Accepted",
  "not-selected": "Not Selected",
  "withdrawn": "Withdrawn",
};

// The normal steps an application goes through, in order.
export const STATUS_STEPS = ["applied", "trial-scheduled", "trial-done", "accepted"];
