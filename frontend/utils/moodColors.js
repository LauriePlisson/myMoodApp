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
  return "rgba(255, 114, 199, 0.5)"; //"rgba(245, 123, 190, 0.5)"
}
