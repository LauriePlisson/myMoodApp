import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

export default function MoodGrafGifted({ moods }) {
  const screenWidth = Dimensions.get("window").width;

  // Formater les dates (on récupère le jour du mois)
  const formatDate = (dateString) => new Date(dateString).getDate();

  // Transformer tes données
  const data = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const mood = moods.find((m) => formatDate(m.label) === day);

    return {
      value: mood ? mood.value : null, // null => pas de point visible
      label: "", // pas de label sur l'axe X
      onPress: () => {
        if (mood) {
          console.log(`Jour ${day}: valeur ${mood.value}`);
        }
      },
      dataPointLabelComponent: mood ? undefined : () => <></>, // évite le rendu d’un label vide
    };
  });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        backgroundColor: "white",
        borderRadius: 15,
      }}
    >
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        spacing={10} // espacement entre les points
        initialSpacing={0}
        // hideRules
        rulesColor={"#F095C3"}
        hideYAxisText={false}
        hideDataPoints={false}
        showVerticalLines={false}
        yAxisThickness={3}
        xAxisThickness={3}
        yAxisColor="#E1E1E1"
        xAxisColor="#E1E1E1"
        maxValue={10}
        noOfSections={10}
        color="#D8BECB"
        curved={false} // passe à true si tu veux une courbe lissée
        thickness={2}
        dataPointsColor="#F095C3"
        startFillColor="#D8BECB30"
        endFillColor="#D8BECB00"
        animateOnDataChange
        animationDuration={800}
        areaChart={false}
        pointerConfig={{
          showPointerStrip: true,
          showPointerLabel: true,
          pointerStripColor: "#D8BECB",
          pointerColor: "#F095C3",
          radius: 6,
          pointerLabelComponent: ({ value, index }) => {
            if (!value) return null;
            return (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 6,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: "#F095C3",
                }}
              >
                <Text style={{ color: "#F095C3" }}>
                  Jour {index + 1} : {value}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
