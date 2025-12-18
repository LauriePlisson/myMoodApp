import { View } from "react-native";

export default function MoodBar({
  value,
  width = 25,
  height = 25,
  color = "#00B0FF",
  crans = 4,
}) {
  if (value === null) return null;

  const cranHeight = height / crans;
  let filledCranCount = 0;
  if (value <= 3) filledCranCount = 1;
  else if (value <= 6) filledCranCount = 2;
  else if (value <= 8) filledCranCount = 3;
  else filledCranCount = 4;

  const cransArray = Array.from({ length: crans }).map((_, i) => {
    const isFilled = i >= crans - filledCranCount; // remplissage depuis le bas
    return (
      <View
        key={i}
        style={{
          opacity: 0.8,
          width: "100%",
          height: cranHeight - 1,
          marginTop: 1,
          backgroundColor: isFilled ? color : "#ddd",
          borderRadius: 2,
        }}
      />
    );
  });

  return (
    <View
      style={{
        width,
        height,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {cransArray}
    </View>
  );
}
