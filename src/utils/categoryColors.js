// Each category gets a short "slug", used as a CSS class (e.g. "cat-sports").
// The colours for each class are set in App.css.
const categorySlugs = {
  "Sports": "sports",
  "Arts and Culture": "arts",
  "Leadership": "leadership",
  "Academic School Clubs": "academic",
  "Adventure Learning Club": "adventure",
  "Service-Learning Club": "service",
};

export function getCategoryStyle(category) {
  return { slug: categorySlugs[category] || "other" };
}