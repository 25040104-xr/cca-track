import CCABanner from "./CCABanner";
import TagList from "./TagList";

function CCACard({ cca, onSelect }) {
  return (
    <div className="cca-card">
      <CCABanner cca={cca} size="small" />
      <div className="cca-card-body">
        <span className="cca-category">{cca.category}</span>
        <h3>{cca.name}</h3>
        <TagList tags={cca.tags} max={2} />
        <p>{cca.description}</p>
        <p className="cca-schedule">🕒 {cca.trainingSchedule}</p>
        <p className="cca-response">Replies within {cca.responseDays} days</p>
        <button className="btn" onClick={() => onSelect(cca.id)}>
          View details
        </button>
      </div>
    </div>
  );
}

export default CCACard;