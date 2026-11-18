import { getCCAById } from "../services/ccaService";
import { getCategoryStyle } from "../utils/categoryColors";
import CCABanner from "../components/CCABanner";
import TagList from "../components/TagList";
import Emoji3D from "../components/Emoji3D";

function CCADetailPage({ ccaId, navigate }) {
  const cca = getCCAById(ccaId);

  if (!cca) {
    return (
      <div className="page">
        <div className="no-results">
          <h3>Sorry, this CCA could not be found.</h3>
          <button className="btn btn-primary" onClick={() => navigate("directory")}>
            Back to CCAs
          </button>
        </div>
      </div>
    );
  }

  const categoryStyle = getCategoryStyle(cca.category);

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate("directory")}>
        ← Back to CCAs
      </button>

      <div className={`detail-hero cat-${categoryStyle.slug}`}>
        <CCABanner cca={cca} size="large" />
        <div className="detail-title">
          <span className="cca-category">{cca.category}</span>
          <h1>{cca.name}</h1>
          <TagList tags={cca.tags} />
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section">
            <h2>About</h2>
            <p>{cca.about || cca.description}</p>
          </section>

          {cca.activities && cca.activities.length > 0 && (
            <section className="detail-section">
              <h2>What you'll do</h2>
              <ul className="activity-list">
                {cca.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="detail-side">
          <h2>Details</h2>
          <ul className="detail-list">
            <li>
              <span className="detail-icon">
                <Emoji3D emoji="🕒" size={24} />
              </span>
              <div>
                <strong>Training</strong>
                <p>{cca.trainingSchedule}</p>
              </div>
            </li>
            {cca.commitment && (
              <li>
                <span className="detail-icon">
                  <Emoji3D emoji="📅" size={24} />
                </span>
                <div>
                  <strong>Commitment</strong>
                  <p>{cca.commitment}</p>
                </div>
              </li>
            )}
            <li>
              <span className="detail-icon">
                <Emoji3D emoji="📍" size={24} />
              </span>
              <div>
                <strong>Venue</strong>
                <p>{cca.venue}</p>
              </div>
            </li>
            <li>
              <span className="detail-icon">
                <Emoji3D emoji="📬" size={24} />
              </span>
              <div>
                <strong>Reply time</strong>
                <p>Within {cca.responseDays} days of applying</p>
              </div>
            </li>
          </ul>

          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("apply", { ccaId: cca.id })}
          >
            Apply now
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CCADetailPage;