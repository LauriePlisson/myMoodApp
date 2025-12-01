export function getColorFromMoodValue(value) {
  if (value === null) return "black";
  if (value < 3) return "rgba(212, 188, 205, 1)";
  if (value < 6) return "rgba(232, 168, 217, 1)";
  if (value < 8) return "#FF8DD8"; //"rgba(243, 169, 211, 1)";
  return "#F46FCB";
}

export function getColorBackgroundFromMoodValue(value, fallback = null) {
  if (value === null) return "white";
  if (value < 3) return "rgba(212, 188, 205, 0.1)";
  if (value < 6) return "rgba(232, 168, 217, 0.2)";
  if (value < 8) return "rgba(255, 141, 216, 0.3)"; //"rgba(243, 169, 211, 1)";
  return "rgba(244, 111, 203, 0.5)";
}

// function getColorFromMoodValue(value) {
//   if (value === null) return "black";
//   if (value < 3) return "#bac6f2ff";
//   if (value < 6) return "rgba(132, 119, 217, 1)";
//   if (value < 8) return "#bf84d9ff";
//   return "rgba(245, 123, 190, 1)";
// }

// function getColorBackgroundFromMoodValue(value) {
//   if (value === null) return "black";
//   if (value < 3) return "#d1d8f233";
//   if (value < 6) return "#8477d933";
//   if (value < 8) return "#bf84d933";
//   return "#f57bbe33";
// }
