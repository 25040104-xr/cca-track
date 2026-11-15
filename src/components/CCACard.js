function CCACard({ cca, onSelect }) {
  return (
    <div className="cca-card">
      <span className="cca-category">{cca.category}</span>
      <h3>{cca.name}</h3>
      <p>{cca.description}</p>
      <p className="cca-schedule">🕒 {cca.trainingSchedule}</p>
      <p className="cca-response">Replies within {cca.responseDays} days</p>
      <button className="btn" onClick={() => onSelect(cca.id)}>
        View details
      </button>
    </div>
  );
}

export default CCACard;