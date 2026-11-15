import { useState, useEffect } from "react";
import { getAllCCAs } from "../services/ccaService";
import CCACard from "../components/CCACard";

function CCADirectoryPage() {
  const [ccas, setCcas] = useState([]);

  useEffect(() => {
    getAllCCAs().then((data) => setCcas(data));
  }, []);

  return (
    <div>
      <h2>Explore CCAs</h2>
      <div className="cca-grid">
        {ccas.map((cca) => (
          <CCACard key={cca.id} cca={cca} />
        ))}
      </div>
    </div>
  );
}

export default CCADirectoryPage;