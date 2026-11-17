import { useState, useEffect } from "react";
import { getAllCCAs } from "../services/ccaService";
import CCACard from "../components/CCACard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

function CCADirectoryPage({ navigate }) {
  const [ccas, setCcas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [beginnerOnly, setBeginnerOnly] = useState(false);

  useEffect(() => {
    getAllCCAs().then((data) => setCcas(data));
  }, []);

  const categories = ["All", ...new Set(ccas.map((cca) => cca.category))];

  const filteredCcas = ccas.filter((cca) => {
    const matchesSearch = cca.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || cca.category === category;
    const tags = cca.tags || [];
    const matchesBeginner = !beginnerOnly || tags.includes("Beginner-friendly");
    return matchesSearch && matchesCategory && matchesBeginner;
  });

  // Copy the array before sorting so we don't change the original
  const sortedCcas = [...filteredCcas].sort((a, b) => {
    if (sortBy === "fastestReply" && a.responseDays !== b.responseDays) {
      return a.responseDays - b.responseDays;
    }
    return a.name.localeCompare(b.name);
  });

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setBeginnerOnly(false);
  }

  return (
    <div className="page">
      <h2>Explore CCAs</h2>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search CCAs by name..."
      />
      <FilterBar options={categories} selected={category} onSelect={setCategory} />

      <div className="directory-controls">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={beginnerOnly}
            onChange={(e) => setBeginnerOnly(e.target.checked)}
          />
          Beginner-friendly only
        </label>

        <label className="sort-label">
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name (A–Z)</option>
            <option value="fastestReply">Fastest reply first</option>
          </select>
        </label>
      </div>

      <p className="result-count">
        Showing {sortedCcas.length} of {ccas.length} CCAs
      </p>

      {sortedCcas.length === 0 ? (
        <div className="no-results">
          <p>No CCAs match your search.</p>
          <button className="btn" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="cca-grid">
          {sortedCcas.map((cca) => (
            <CCACard
              key={cca.id}
              cca={cca}
              onSelect={(id) => navigate("ccaDetail", { ccaId: id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CCADirectoryPage;