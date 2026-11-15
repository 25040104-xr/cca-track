function FilterBar({ options, selected, onSelect }) {
  return (
    <div className="filter-bar">
      {options.map((option) => (
        <button
          key={option}
          className={option === selected ? "filter-btn active" : "filter-btn"}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;