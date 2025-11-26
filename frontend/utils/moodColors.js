export function getColorFromMoodValue(value) {
  if (value === null) return "black";
  if (value < 3) return "rgba(192, 190, 200, 1)";
  if (value < 6) return "rgba(186, 198, 242, 1)";
  if (value < 8) return "rgba(242, 187, 217, 1)";
  return "#f57bbeff";
}

export function getColorBackgroundFromMoodValue(value, fallback = null) {
  if (value === null) return fallback ?? "white"; // ou ton colors.simpleInv
  if (value < 3) return "rgba(192, 190, 200, 0.2)";
  if (value < 6) return "rgba(186, 198, 242, 0.2)";
  if (value < 8) return "rgba(242, 187, 217, 0.2)";
  return "rgba(245, 123, 190, 0.2)";
}
