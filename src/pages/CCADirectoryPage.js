import { useState } from "react";
import { getAllCCAs } from "../services/ccaService";
import CCACard from "../components/CCACard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

function CCADirectoryPage({ navigate }) {
  const ccas = getAllCCAs();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [beginnerOnly, setBeginnerOnly] = useState(false);

  const categories = ["All", ...new Set(ccas.map((cca) => cca.category))];

  const filteredCcas = ccas.filter((cca) => {
    const matchesSearch = cca.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || cca.category === category;
    const tags = cca.tags || [];
    const matchesBeginner = !beginnerOnly || tags.includes("Beginner-friendly");
    return matchesSearch && matchesCategory && matchesBeginner;
  });

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
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Find your CCA </p>
          <h1>Pick a CCA. We'll tell you when they reply.</h1>
          <p className="hero-intro">
            Browse all {ccas.length} CCAs at RP, apply in a few minutes, and track
            every application in one place.
          </p>
        </div>
      </section>

      <div className="directory-layout">
        <aside className="toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search CCAs by name..."
          />
          <FilterBar options={categories} selected={category} onSelect={setCategory} />

          <div className="directory-controls">
            <label className={beginnerOnly ? "toggle-chip on" : "toggle-chip"}>
              <input
                type="checkbox"
                checked={beginnerOnly}
                onChange={(e) => setBeginnerOnly(e.target.checked)}
              />
              Beginner-friendly only
            </label>

            <label className="sort-label">
              Sort by
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name (A–Z)</option>
                <option value="fastestReply">Fastest reply first</option>
              </select>
            </label>
          </div>
        </aside>

        <div className="directory-results">
          <p className="result-count">
            Showing <strong>{sortedCcas.length}</strong> of {ccas.length} CCAs
          </p>

          {sortedCcas.length === 0 ? (
            <div className="no-results">
              <h3>No CCAs match your search</h3>
              <p>Try a different name or category.</p>
              <button className="btn btn-primary" onClick={clearFilters}>
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
      </div>
    </div>
  );
}

export default CCADirectoryPage;