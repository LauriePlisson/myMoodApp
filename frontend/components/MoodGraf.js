import React from "react";
import { View, Dimensions } from "react-native";
// import { LineChart } from "react-native-gifted-charts";
import {
  Svg,
  Line,
  Circle,
  Text,
  Polyline,
  Rect,
  Path,
} from "react-native-svg";
import { LineChart } from "react-native-chart-kit";

export default function MoodGraf({ moods }) {
  const screenWidth = Dimensions.get("window").width;

  function formatDate(dateString) {
    return new Date(dateString).getDate();
  }

  const dot = moods.map((mood) => ({
    y: mood.value,
    x: formatDate(mood.label),
  }));

  const normalizedData = Array.from({ length: 31 }, (_, i) => {
    const point = dot.find((p) => p.x === i + 1); // number === number
    return point ? point.y : null;
  });

  const data = {
    labels: Array(31).fill(""),
    datasets: [
      {
        data: normalizedData, // tes valeurs
        color: (opacity = 1) => `rgba(216, 190, 203,1)`, // couleur de la ligne
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => ` rgba(216, 190, 203,1)`,
    labelColor: (opacity = 1) => `rgba(216, 190, 203,1)`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "2",
      stroke: "rgba(240, 149, 195, 1)",
    },
  };

  return (
    <View
      style={{
        width: 300,
        height: 300,
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LineChart
        data={data}
        width={screenWidth - 16}
        height={220}
        chartConfig={chartConfig}
        bezier
        withVerticalLines={false}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}
// const width = 350;
// const height = 300;
// const padding = 23;
// const maxX = 31;
// const maxY = 10;
// const numXTicks = 31;
// const numYTicks = 10;

// const scaleX = (width - 2 * padding) / maxX;
// const scaleY = (height - 2 * padding) / maxY;

// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString("fr-FR", {
//     day: "2-digit",
//   });
// }

// let dot = [];
// const dataTable = data.map((mood, i) => {
//   dot.push({
//     y: mood.value,
//     x: formatDate(mood.label),
//     // color: getColorFromMoodValue(mood.value),
//   });
// });
// const svgPoints = dot.map(({ x, y, color }) => ({
//   x: padding + x * scaleX,
//   y: height - padding - y * scaleY,
//   // color: color,
// }));

// const pathData = svgPoints.reduce((acc, point, i) => {
//   return i === 0
//     ? `M ${point.x} ${point.y}`
//     : `${acc} L ${point.x} ${point.y}`;
// }, "");
// // Création des graduations pour X
// const xTicks = Array.from({ length: numXTicks + 1 }, (_, i) => {
//   const x = padding + (i * (width - 2 * padding)) / numXTicks;
//   return x;
// });

// // Création des graduations pour Y
// const yTicks = Array.from({ length: numYTicks + 1 }, (_, i) => {
//   const y = height - padding - (i * (height - 2 * padding)) / numYTicks;
//   return y;
// });

// return (
//   <View style={{ alignItems: "center", marginTop: 50 }}>
//     <Svg width={width} height={height}>
//       {/* Fond du graphique */}
//       <Rect
//         x={0}
//         y={0}
//         width={width}
//         height={height}
//         fill="#ffffffff"
//         stroke="#d8becbff"
//       />
//       <Line
//         x1={padding}
//         y1={height - padding}
//         x2={width - padding}
//         y2={height - padding}
//         stroke="#d8becbff"
//         strokeWidth="2"
//       />
//       <Line
//         x1={padding}
//         y1={padding}
//         x2={padding}
//         y2={height - padding}
//         stroke="#d8becbff"
//         strokeWidth="2"
//       />
//       {xTicks.map((x, i) => (
//         <React.Fragment key={i}>
//           <Line
//             x1={x}
//             y1={height - padding}
//             x2={x}
//             y2={height - padding + 5}
//             stroke="#d8becbff"
//             strokeWidth="1"
//           />
//         </React.Fragment>
//       ))}

//       {/* Graduations axe Y */}
//       {yTicks.map((y, i) => (
//         <React.Fragment key={i}>
//           <Line
//             x1={padding - 5}
//             y1={y}
//             x2={padding}
//             y2={y}
//             stroke="#d8becbff"
//             strokeWidth="1"
//           />
//           <Text
//             x={padding - 10}
//             y={y + 3}
//             fontSize="10"
//             fill="#d8becbff"
//             textAnchor="end"
//           >
//             {i}
//           </Text>
//         </React.Fragment>
//       ))}

//       <Path d={pathData} fill="none" stroke="#d8becbff" strokeWidth="2" />
//       {svgPoints.map((p, i) => (
//         <Circle key={i} cx={p.x} cy={p.y} r={4} fill="#d8becbff" />
//       ))}
//     </Svg>
//   </View>
// );
// GRAPHIQUE GIFTED CHARTS
// const daysWithMood = data.map((m) => new Date(m.label).getDate());
// const firstDay = Math.min(...daysWithMood);
// const lastDay = Math.max(...daysWithMood);
// const chartData = [];
// for (let day = firstDay; day <= lastDay; day++) {
//   const mood = data.find((m) => new Date(m.label).getDate() === day);
//   chartData.push({
//     value: mood ? mood.value : null,
//     label: day.toString(),
//   });
// }
// const fullMonth = Array.from({ length: 31 }, (_, i) => {
//   const day = i + 1;
//   const mood = data.find((m) => new Date(m.label).getDate() === day);
//   return {
//     value: mood ? mood.value : null,
//     label: day % 3 === 1 ? day.toString() : "", // label tous les 3 jours
//   };
// });
// return (
//   <View style={{ padding: 20 }}>
//     <LineChart
//       data={fullMonth}
//       height={220}
//       width={350}
//       spacing={12}
//       initialSpacing={0}
//       yAxisThickness={0}
//       xAxisHeight={30}
//       color="#d8becb"
//       textColor="#444"
//       maxValue={10}
//       minValue={0}
//       showVerticalLines={false}
//       showReferenceLine1
//       referenceLine1Config={{ color: "#eee", thickness: 1 }}
//     />
//   </View>
// );
// }
