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
      dataPointLabelComponent: mood ? null : () => <></>, // évite le rendu d’un label vide
    };
  });
  const chartWidth = screenWidth - 32;
  const spacing = chartWidth / (data.length - 1); // répartir exactement

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
        // width={screenWidth - 32}
        height={220}
        width={chartWidth}
        spacing={spacing}
        // spacing={(screenWidth - 32) / 31} // répartir les points exactement
        initialSpacing={0}
        // hideRules
        rulesColor={"#F095C3"}
        hideYAxisText={false}
        hideDataPoints={false}
        showVerticalLines={false}
        yAxisThickness={3}
        xAxisThickness={3}
        yAxisTextStyle={{ color: "#F095C3" }}
        yAxisColor="#D8BECB"
        xAxisColor="#D8BECB"
        maxValue={10}
        noOfSections={10}
        color="#D8BECB"
        curved={false} // passe à true si tu veux une courbe lissée
        thickness={2}
        areaChart // 🔥 active le remplissage sous la courbe
        startFillColor="rgba(237, 132, 184, 0.3)" // début du dégradé
        endFillColor="rgba(216, 190, 203, 0.0)" // fin du dégradé (transparent)
        startOpacity={0.4} // (optionnel) contrôle la transparence de départ
        endOpacity={0.1} // (optionnel) contrôle la transparence à la fin
        dataPointsRadius={5} // 🔹 arrondi du point (petit cercle)
        dataPointsColor="#F095C3"
        // animateOnDataChange
        // animationDuration={800}
        // pointerConfig={{
        //   showPointerStrip: true,
        //   showPointerLabel: true,
        //   pointerStripColor: "#D8BECB",
        //   pointerColor: "#F095C3",
        //   radius: 6,
        //   pointerLabelComponent: ({ value, index }) => {
        //     if (!value) return null;
        //     return (
        //       <View
        //         style={{
        //           backgroundColor: "white",
        //           borderRadius: 6,
        //           padding: 4,
        //           borderWidth: 1,
        //           borderColor: "#F095C3",
        //         }}
        //       >
        //         <Text style={{ color: "#F095C3" }}>
        //           Jour {index + 1} : {value}
        //         </Text>
        //       </View>
        //     );
        //   },
        // }}
      />
    </View>
  );
}
