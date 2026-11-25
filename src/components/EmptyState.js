// Reusable box shown when a list has nothing to display.
// Props:
// - icon: an emoji shown at the top (default 📭)
// - title: the main message
// - message: a smaller line under the title (optional)
function EmptyState({ icon = "📭", title, message }) {
  return (
    <div className="empty-state">
      <p className="no-results-icon">{icon}</p>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EmptyState;