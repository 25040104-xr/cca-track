import { useState, useEffect } from "react";
import { getAllCCAs } from "../services/ccaService";
import CCACard from "../components/CCACard";

function CCADirectoryPage({ navigate }) {
  const [ccas, setCcas] = useState([]);

  useEffect(() => {
    getAllCCAs().then((data) => setCcas(data));
  }, []);

  return (
    <div className="page">
      <h2>Explore CCAs</h2>
      <div className="cca-grid">
        {ccas.map((cca) => (
          <CCACard
            key={cca.id}
            cca={cca}
            onSelect={(id) => navigate("ccaDetail", { ccaId: id })}
          />
        ))}
      </div>
    </div>
  );
}

export default CCADirectoryPage;