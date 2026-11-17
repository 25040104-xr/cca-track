import { useState, useEffect } from "react";
import { getCCAById } from "../services/ccaService";
import CCABanner from "../components/CCABanner";
import TagList from "../components/TagList";

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
        <CCABanner cca={cca} size="large" />

        <div className="detail-body">
          <span className="cca-category">{cca.category}</span>
          <h2>{cca.name}</h2>
          <TagList tags={cca.tags} />

          <h3>About</h3>
          <p>{cca.about || cca.description}</p>

          {cca.activities && cca.activities.length > 0 && (
            <>
              <h3>What you'll do</h3>
              <ul className="activity-list">
                {cca.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </>
          )}

          <h3>Details</h3>
          <ul className="detail-list">
            <li>🕒 <strong>Training:</strong> {cca.trainingSchedule}</li>
            {cca.commitment && (
              <li>📅 <strong>Commitment:</strong> {cca.commitment}</li>
            )}
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
    </div>
  );
}

export default CCADetailPage;