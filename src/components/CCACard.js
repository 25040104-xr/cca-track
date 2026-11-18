import CCABanner from "./CCABanner";
import TagList from "./TagList";
import Emoji3D from "./Emoji3D";
import { getCategoryStyle } from "../utils/categoryColors";

function CCACard({ cca, onSelect }) {
  const categoryStyle = getCategoryStyle(cca.category);

  return (
    <div className={`cca-card cat-${categoryStyle.slug}`}>
      <CCABanner cca={cca} size="small" />

      <div className="cca-card-body">
        <span className="cca-category">{cca.category}</span>
        <h3>{cca.name}</h3>
        <TagList tags={cca.tags} max={2} />
        <p className="cca-description">{cca.description}</p>

        <div className="cca-meta">
          <p>
            <Emoji3D emoji="🕒" size={18} /> {cca.trainingSchedule}
          </p>
          <p>
            <Emoji3D emoji="📬" size={18} /> Replies within {cca.responseDays} days
          </p>
        </div>

        <button className="btn btn-small" onClick={() => onSelect(cca.id)}>
          View details →
        </button>
      </div>
    </div>
  );
}

export default CCACard;