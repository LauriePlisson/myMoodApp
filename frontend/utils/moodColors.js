export function getColorFromMoodValue(value) {
  if (value === null) return "#A48A97";
  if (value < 3) return "#C8C0CA";
  if (value < 6) return "#B291C0";
  if (value < 8) return "#E7A2C5";
  return "#F57BBE";
}

export function getColorBackgroundFromMoodValue(value, fallback = null) {
  if (value === null) return "#a37794ff";
  if (value < 3) return "rgba(200, 192, 202, 0.5)";
  if (value < 6) return "rgba(178, 145, 192, 0.5)";
  if (value < 8) return "rgba(231, 162, 197, 0.5)"; //"rgba(218, 154, 200, 0.5)";
  return "rgba(255, 114, 199, 0.5)"; //"rgba(245, 123, 190, 0.5)";
  // if (value === null) return "#a37794ff";
  // if (value < 3) return "rgba(177, 47, 121, 0.57)";
  // if (value < 6) return "rgba(229, 93, 166, 0.57)";
  // if (value < 8) return "hsla(331, 93%, 89%, 1.00)";
  // return "#df007ba4";
  // if (value === null) return "white";
  // if (value < 3) return "hsla(319, 15%, 70%, 0.3)";
  // if (value < 6) return "hsla(319, 59%, 35%, 0.30)";
  // if (value < 8) return "hsla(319, 80%, 80%, 0.3)";
  // return "hsla(319, 95%, 80%, 0.3)";
  // if (value < 3) return "hsla(318, 10%, 92%, 0.9)";
  // if (value < 6) return "hsla(318, 35%, 80%, 0.7)";
  // if (value < 8) return "hsla(318, 58%, 70%, 0.7)";
  // return "hsla(318, 65%, 60%, 0.8)";
}
