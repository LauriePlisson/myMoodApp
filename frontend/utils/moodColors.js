const MOOD_COLORS = {
  veryLow: "#ccbfc8ff",
  low: "#dbb1cfff",
  neutral: "#D18ABF",
  good: "#ef88ccff",
  veryGood: "#ef5faeff",
};

export function getMoodLevel(value) {
  if (value === null) return null;
  if (value < 2) return "veryLow";
  if (value <= 3) return "low";
  if (value <= 5) return "neutral";
  if (value <= 7) return "good";
  return "veryGood";
}

export function getMoodColor(value) {
  const level = getMoodLevel(value);
  if (level === null) return "#D8BECB"; // fallback neutre
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
