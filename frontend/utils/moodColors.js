export function getColorFromMoodValue(value) {
  if (value === null) return "#a37794ff";
  if (value < 3) return "hsla(319, 25%, 55%, 1.00)";
  if (value < 6) return "hsla(319, 45%, 60%, 1.00)";
  if (value < 8) return "hsla(319, 50%, 70%, 1.00)";
  return "hsla(319, 90%, 80%, 1.00)";
}

export function getColorBackgroundFromMoodValue(value, fallback = null) {
  if (value === null) return "white";
  if (value < 3) return "hsla(319, 15%, 70%, 0.3)";
  if (value < 6) return "hsla(319, 50%, 70%, 0.3)";
  if (value < 8) return "hsla(319, 80%, 80%, 0.3)";
  return "hsla(319, 95%, 80%, 0.3)";
  // if (value < 3) return "hsla(318, 10%, 92%, 0.9)";
  // if (value < 6) return "hsla(318, 35%, 80%, 0.7)";
  // if (value < 8) return "hsla(318, 58%, 70%, 0.7)";
  // return "hsla(318, 65%, 60%, 0.8)";
}
