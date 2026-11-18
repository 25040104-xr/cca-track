import Emoji3D from "./Emoji3D";

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

  // Otherwise show the CCA's 3D illustration
  return (
    <div className={`cca-banner cca-banner-${size}`} aria-hidden="true">
      <span className="banner-art">
        <Emoji3D emoji={cca.emoji} size={size === "large" ? 190 : 118} />
      </span>
    </div>
  );
}

export default CCABanner;