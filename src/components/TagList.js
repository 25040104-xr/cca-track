function TagList({ tags, max }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const shownTags = max ? tags.slice(0, max) : tags;

  return (
    <div className="tag-list">
      {shownTags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default TagList;