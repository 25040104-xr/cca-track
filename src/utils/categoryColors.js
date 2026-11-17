// Background colours for each CCA category (used when a CCA has no photo)
const categoryColors = {
  "Sports": "linear-gradient(135deg, #22c55e, #15803d)",
  "Arts and Culture": "linear-gradient(135deg, #f472b6, #be185d)",
  "Leadership": "linear-gradient(135deg, #facc15, #ca8a04)",
  "Academic School Clubs": "linear-gradient(135deg, #38bdf8, #0369a1)",
  "Adventure Learning Club": "linear-gradient(135deg, #fb923c, #c2410c)",
  "Service-Learning Club": "linear-gradient(135deg, #a78bfa, #6d28d9)",
};

const defaultColor = "linear-gradient(135deg, #818cf8, #4f46e5)";

export function getCategoryColor(category) {
  return categoryColors[category] || defaultColor;
}