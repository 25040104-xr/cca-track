import { useState } from "react";

const BASE_URL = "https://cdn.jsdelivr.net/npm/@lobehub/fluent-emoji-3d@1.1.0/assets/";

// Turns an emoji into its file name, e.g. "🎸" -> "1f3b8"
function toFileName(emoji) {
  return Array.from(emoji)
    .map((char) => char.codePointAt(0).toString(16))
    .join("-");
}

function Emoji3D({ emoji, size = 32, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!emoji) {
    return null;
  }

  if (failed) {
    return (
      <span
        className={`emoji-3d ${className}`}
        style={{ fontSize: size * 0.8 }}
        aria-hidden="true"
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      className={`emoji-3d ${className}`}
      src={`${BASE_URL}${toFileName(emoji)}.webp`}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}

export default Emoji3D;