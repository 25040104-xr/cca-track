import { useState, useEffect } from "react";
import { getCCAById } from "../services/ccaService";

function CCADetailPage({ ccaId, navigate }) {
  const [cca, setCca] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCCAById(ccaId).then((data) => {
      setCca(data);
      setLoading(false);
    });
  }, [ccaId]);

  if (loading) {
    return <p className="page">Loading...</p>;
  }

  if (!cca) {
    return (
      <div className="page no-results">
        <p>Sorry, this CCA could not be found.</p>
        <button className="btn" onClick={() => navigate("directory")}>
          Back to CCAs
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate("directory")}>
        ← Back to CCAs
      </button>

      <div className="detail-card">
        <span className="cca-category">{cca.category}</span>
        <h2>{cca.name}</h2>
        <p>{cca.description}</p>

        <ul className="detail-list">
          <li>🕒 <strong>Training:</strong> {cca.trainingSchedule}</li>
          <li>📍 <strong>Venue:</strong> {cca.venue}</li>
          <li>📬 <strong>Reply time:</strong> within {cca.responseDays} days of applying</li>
        </ul>

        <button
          className="btn btn-primary"
          onClick={() => navigate("apply", { ccaId: cca.id })}
        >
          Apply now
        </button>
      </div>
    </div>
  );
}

export default CCADetailPage;