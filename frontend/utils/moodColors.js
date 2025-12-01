export function getColorFromMoodValue(value) {
  if (value === null) return "black";
  if (value < 3) return "rgba(103, 102, 103, 1)";
  if (value < 6) return "rgba(203, 148, 189, 1)";
  if (value < 8) return "rgba(237, 104, 177, 1)"; //"#FF8DD8";
  return "rgba(245, 123, 190, 1)"; //"rgba(253, 163, 226, 1)";
}

export function getColorBackgroundFromMoodValue(value, fallback = null) {
  if (value === null) return "white";
  if (value < 3) return "rgba(103, 102, 103, 0.2)";
  if (value < 6) return "rgba(203, 148, 189, 0.3)";
  if (value < 8) return "rgba(237, 104, 177, 0.3)"; //"rgba(243, 169, 211, 1)";
  return "rgba(245, 123, 190, 0.4)";
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
