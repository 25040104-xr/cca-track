import { useState, useEffect } from "react";
import { getAllCCAs } from "../services/ccaService";
import CCACard from "../components/CCACard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

function CCADirectoryPage({ navigate }) {
  const [ccas, setCcas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    getAllCCAs().then((data) => setCcas(data));
  }, []);

  const categories = ["All", ...new Set(ccas.map((cca) => cca.category))];

  const filteredCcas = ccas.filter((cca) => {
    const matchesSearch = cca.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || cca.category === category;
    return matchesSearch && matchesCategory;
  });

  function clearFilters() {
    setSearch("");
    setCategory("All");
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

      <p className="result-count">
        Showing {filteredCcas.length} of {ccas.length} CCAs
      </p>

      {filteredCcas.length === 0 ? (
        <div className="no-results">
          <p>No CCAs match your search.</p>
          <button className="btn" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="cca-grid">
          {filteredCcas.map((cca) => (
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