function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-wrapper">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        type="text"
        className="search-bar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;