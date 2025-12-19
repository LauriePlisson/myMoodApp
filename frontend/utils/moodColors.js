const MOOD_COLORS = {
  veryLow: "#ccbfc8ff",
  low: "#dbb1cfff",
  neutral: "#D18ABF",
  good: "#ef88ccff",
  veryGood: "#ef5faeff",
};

function getMoodLevel(value) {
  if (value === null) return null;
  if (value < 2) return "veryLow";
  if (value <= 3) return "low";
  if (value <= 5) return "neutral";
  if (value <= 7) return "good";
  return "veryGood";
}

export function getMoodColor(value) {
  const level = getMoodLevel(value);
  if (!level) return "#A48A97"; // fallback neutre
  return MOOD_COLORS[level];
}

export function getMoodBackgroundColor(value, alpha = 0.25) {
  const color = getMoodColor(value);
  if (!color) return "white";

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
// export function getColorFromMoodValue(value) {
//   if (value === null) return "#A48A97";
//   if (value < 2) return "#C8C0CA";
//   if (value <= 3) return "#B291C0";
//   if (value <= 5) return "#E7A2C5";
//   if (value <= 7) return "";
//   return "#F57BBE";
// }

// export function getColorBackgroundFromMoodValue(value, fallback = null) {
//   if (value === null) return "white";
//   if (value < 2) return "rgba(200, 192, 202, 0.5)";
//   if (value <= 3) return "rgba(178, 145, 192, 0.5)";
//   if (value <= 5) return "rgba(231, 162, 197, 0.5)"; //"rgba(218, 154, 200, 0.5)";
//   if (value <= 7) return "";
//   return "rgba(255, 114, 199, 0.5)"; //"rgba(245, 123, 190, 0.5)"
// }
