import Svg, { Circle } from "react-native-svg";
import { getMoodLevel } from "../utils/moodColors";

export default function MoodRing({
  value,
  size = 70,
  strokeWidth = 2,
  color,
  opacity,
}) {
  if (value === null) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const minStrokeLength = 1;

  // const percentage = Math.max(value, 0) / 10;
  const level = getMoodLevel(value);
  function getMoodPercentageFromLevel(level) {
    switch (level) {
      case "veryLow":
        return 0.05;
      case "low":
        return 0.25;
      case "neutral":
        return 0.5;
      case "good":
        return 0.75;
      case "veryGood":
        return 1;
      default:
        return 0;
    }
  }
  const percentage = getMoodPercentageFromLevel(level);

  let dashOffset;
  let dashArray;

  if (value === 0) {
    dashArray = `${minStrokeLength} ${circumference}`;
    dashOffset = 0;
  } else {
    dashArray = circumference;
    dashOffset = circumference * (1 - percentage);
  }

  const center = size / 2;
  return (
    <Svg
      width={size}
      height={size}
      style={{ position: "absolute" }}
      opacity={opacity}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        fill="none"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </Svg>
  );
}
