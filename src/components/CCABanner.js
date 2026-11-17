import { getCategoryColor } from "../utils/categoryColors";

function CCABanner({ cca, size = "small" }) {
  // Show the real photo if the CCA has one
  if (cca.imageUrl) {
    return (
      <img
        className={`cca-banner cca-banner-${size}`}
        src={cca.imageUrl}
        alt={cca.name}
      />
    );
  }

  // Otherwise show a coloured banner with the CCA's emoji
  return (
    <div
      className={`cca-banner cca-banner-${size}`}
      style={{ background: getCategoryColor(cca.category) }}
      aria-hidden="true"
    >
      <span className="cca-banner-emoji">{cca.emoji}</span>
    </div>
  );
}

export default CCABanner;