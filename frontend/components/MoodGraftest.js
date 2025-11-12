import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function MoodGrafGifted({
  moods,
  period,
  selectedDate,
  setSelectedDate,
}) {
  let length;
  let getIndex;
  const { theme } = useTheme();
  const { colors } = useTheme();
  const s = styles(colors);

  if (period === "semaine") {
    length = 7;
    getIndex = (m) => parseInt(m.label, 6) - 1;
  } else if (period === "mois") {
    length = 31;
    getIndex = (m) => parseInt(m.label, 10) - 1;
  } else if (period === "annee") {
    length = 12;
    getIndex = (m) => m.label;
  } else {
    length = 31;
    getIndex = (m) => m.label;
  }

  const data = Array.from({ length }, (_, i) => ({
    value: null,
    label: "",
    onPress: () => {},
    dataPointLabelComponent: () => <></>,
  }));

  moods.forEach((mood) => {
    const index = getIndex(mood);
    if (index >= 0 && index < length) {
      data[index] = {
        value: mood.value,
        label: "", // tu peux mettre le jour/mois si tu veux
        onPress: () => console.log(`Index ${index}: valeur ${mood.value}`),
        dataPointLabelComponent: () => <></>,
      };
    }
  });

  let lastIndex = data.length - 1;
  while (lastIndex >= 0 && data[lastIndex].value === null) {
    lastIndex--;
  }
  let firstDataIndex = data.findIndex((d) => d.value !== null);
  for (let i = 0; i < firstDataIndex; i++) {
    data[i].value = 0; // commence à zéro
  }
  const trimmedData = data.slice(0, lastIndex + 1);
  const chartWidth = 290;
  const spacing = chartWidth / (data.length - 1);

  let displayPeriod = "";
  if (period === "annee") {
    displayPeriod = selectedDate.getFullYear();
  } else if (period === "mois") {
    const monthName = selectedDate.toLocaleString("fr-FR", { month: "long" });
    const monthNameCapitalized =
      monthName.charAt(0).toUpperCase() + monthName.slice(1);
    displayPeriod = `${monthNameCapitalized} ${selectedDate.getFullYear()}`;
  } else if (period === "semaine") {
    const dayOfWeek = selectedDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    selectedDate.setDate(selectedDate.getDate() - diffToMonday);
    const endOfWeek = new Date(selectedDate);
    endOfWeek.setDate(selectedDate.getDate() + 6);
    displayPeriod = `Du ${selectedDate.getDate()}/${
      selectedDate.getMonth() + 1
    } au ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}`;
  }

  const handleChevronLeft = () => {
    if (period === "mois") {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(selectedDate.getMonth() - 1);
      setSelectedDate(prevMonth);
    }
    if (period === "semaine") {
      const prevWeek = new Date(selectedDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setSelectedDate(prevWeek);
    }
    if (period === "year") {
      const prevYear = new Date(selectedDate);
      prevYear.setFullYear(prevYear.getFullYear() - 1);
      setSelectedDate(prevYear);
    }
  };

  const handleChevronRight = () => {
    if (period === "mois") {
      const nextMonth = new Date(selectedDate);
      nextMonth.setMonth(selectedDate.getMonth() + 1);
      setSelectedDate(nextMonth);
    }
    if (period === "semaine") {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSelectedDate(nextWeek);
    }
    if (period === "year") {
      const nextYear = new Date(selectedDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setSelectedDate(nextYear);
    }
  };
  return (
    <View style={s.container}>
      <View style={s.grafInfo}>
        <TouchableOpacity onPress={() => handleChevronLeft()}>
          <ChevronLeft color={colors.grafText} />
        </TouchableOpacity>
        <Text style={{ fontSize: 15, color: colors.grafText }}>
          {displayPeriod}
        </Text>
        <TouchableOpacity onPress={() => handleChevronRight()}>
          <ChevronRight color={colors.grafText} />
        </TouchableOpacity>
      </View>
      <LineChart
        data={trimmedData}
        height={220}
        width={chartWidth}
        spacing={spacing}
        initialSpacing={0}
        rulesColor={colors.grafRules}
        hideYAxisText={false}
        hideDataPoints={false}
        showVerticalLines={false}
        yAxisThickness={2}
        xAxisThickness={2}
        yAxisTextStyle={{ color: colors.grafRules, fontSize: 12 }}
        yAxisColor="#D8BECB"
        xAxisColor="#D8BECB"
        minValue={0}
        maxValue={10}
        noOfSections={10}
        color="#D8BECB"
        curved={false}
        thickness={2}
        areaChart // 🔥 active le remplissage sous la courbe
        startFillColor="rgba(237, 132, 184, 0.3)" // début du dégradé
        endFillColor="rgba(216, 190, 190, 0)" // fin du dégradé (transparent)
        startOpacity={0.4} // (optionnel) contrôle la transparence de départ
        endOpacity={0.1} // (optionnel) contrôle la transparence à la fin
        dataPointsRadius={5} // 🔹 arrondi du point (petit cercle)
        dataPointsColor={colors.grafRules}
        // backgroundColor={colors.background}
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

const styles = (colors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      width: 370,
      height: 300,
      backgroundColor: colors.grafBackColor,
      borderRadius: 15,
    },
    grafInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 15,
      marginVertical: 5,
      marginTop: 20,
    },
  });
