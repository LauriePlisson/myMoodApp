import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

export default function MoodGraf({ data }) {
  const daysWithMood = data.map((m) => new Date(m.label).getDate());
  const firstDay = Math.min(...daysWithMood);
  const lastDay = Math.max(...daysWithMood);

  const chartData = [];
  for (let day = firstDay; day <= lastDay; day++) {
    const mood = data.find((m) => new Date(m.label).getDate() === day);
    chartData.push({
      value: mood ? mood.value : null,
      label: day.toString(),
    });
  }

  return (
    <View style={{ padding: 20 }}>
      <LineChart
        data={chartData}
        height={220}
        width={350}
        spacing={30}
        initialSpacing={0}
        yAxisThickness={0}
        xAxisHeight={30}
        color="#d8becb"
        textColor="#444"
        maxValue={10}
        minValue={0}
        showVerticalLines={false}
        showReferenceLine1
        referenceLine1Config={{ color: "#eee", thickness: 1 }}
      />
    </View>
  );
}
