import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function MoodGrafGifted({
  moods,
  period,
  selectedDate,
  setSelectedDate,
  setPeriod,
  displayMood,
  setDisplayMood,
  loadYear,
}) {
  const [selectedMood, setSelectedMood] = useState({});

  let length;
  let getIndex;
  const { theme, colors } = useTheme();
  const s = styles(colors);

  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  function moisEnLettre(numeroMois) {
    return mois[numeroMois];
  }

  if (period === "mois") {
    length = 31;
    getIndex = (m) => m.label;
  } else if (period === "annee") {
    length = 12;
    getIndex = (m) => m.label;
  }

  const data = Array.from({ length }, (_, i) => ({
    value: null,
    label: "",
  }));

  moods.forEach((mood) => {
    const index = getIndex(mood);
    if (index >= 0 && index < length) {
      data[index] = {
        value: mood.value,
        label: mood.label,
      };
    }
  });

  const handleFocus = (mood) => {
    setDisplayMood(true);
    if (period === "annee") {
      const month = moisEnLettre(mood.label);
      setSelectedMood({
        label: `${month}`,
        value: mood.value,
        month: mood.label,
      });
    }
    if (period === "mois") {
      setSelectedMood({
        label: mood.label,
        value: mood.value,
      });
    }
  };

  let lastIndex = data.length - 1;
  while (lastIndex >= 0 && data[lastIndex].value === null) {
    lastIndex--;
  }
  let firstDataIndex = data.findIndex((d) => d.value !== null);
  for (let i = 0; i < firstDataIndex; i++) {
    data[i].value = 0;
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
  }

  const handleChevronLeft = () => {
    if (period === "mois") {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevYear = prevMonth.getFullYear();
      setSelectedDate(prevMonth);
      if (!moods[prevYear]) {
        loadYear(prevYear);
      }
      setSelectedDate(prevMonth);
    }
    if (period === "annee") {
      const prevYearDate = new Date(selectedDate);
      const prevYear = prevYearDate.getFullYear() - 1;

      setSelectedDate(new Date(prevYear, 0, 1));
      loadYear(prevYear);
    }
  };

  const handleChevronRight = () => {
    if (period === "mois") {
      const nextMonth = new Date(selectedDate);
      nextMonth.setMonth(selectedDate.getMonth() + 1);
      setSelectedDate(nextMonth);
    }
    if (period === "annee") {
      const nextYear = new Date(selectedDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setSelectedDate(nextYear);
    }
  };

  function getColorFromMoodValue(value) {
    if (value === "") return "black";
    if (value <= 2) return "#d0094cff";
    if (value < 5) return "#rgba(185, 154, 114, 1)";
    if (value < 7) return "#rgba(72, 153, 151, 1)";
    return "#09d066ff";
  }

  function getColorBackgroundFromMoodValue(value) {
    if (value === "") return "white";
    if (value <= 2) return "rgba(208, 9, 75, 0.42)";
    if (value < 5) return "#rgba(237, 155, 48, 0.42)";
    if (value < 7) return "#rgba(113, 247, 245, 0.42)";
    return "rgba(22, 240, 124, 0.42)";
  }

  const handleVoirMois = () => {
    const year = selectedDate.getFullYear();
    const month = selectedMood.month;
    const newDate = new Date(year, month, 1);

    setPeriod("mois");
    setSelectedDate(newDate);
    setDisplayMood(false);
  };

  return (
    <>
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
      <View style={s.grafContainer}>
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
          yAxisTextStyle={{
            color: colors.grafRules,
            fontSize: 12,
          }}
          yAxisLabelWidth={20}
          yAxisColor="#D8BECB"
          xAxisLabelsHeight={7}
          xAxisLabelTextStyle={{ color: "transparent" }}
          xAxisColor="#D8BECB"
          minValue={0}
          maxValue={10}
          noOfSections={10}
          color="#D8BECB"
          curved={false}
          // curvature={0.015}
          thickness={2}
          areaChart
          startFillColor="rgba(237, 132, 184, 0.3)" // début du dégradé
          endFillColor="rgba(216, 190, 190, 0)" // fin du dégradé (transparent)
          startOpacity={0.4}
          endOpacity={0.1}
          dataPointsRadius={5}
          dataPointLabelRadius={15}
          dataPointsColor={colors.grafRules}
          focusEnabled={true}
          onFocus={(mood) => handleFocus(mood)}
        />
      </View>
      {displayMood && (
        <View
          style={[
            s.carte,
            {
              borderColor: getColorBackgroundFromMoodValue(selectedMood.value),
            },
          ]}
        >
          <View style={[s.topCarte]}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 15, color: colors.text }}>
                Mois de {selectedMood.label}
              </Text>
            </View>
            <TouchableOpacity
              style={s.exit}
              onPress={() => setDisplayMood(false)}
            >
              <X size={20} color={getColorFromMoodValue(selectedMood.value)} />
            </TouchableOpacity>
          </View>

          <>
            <View style={s.moodInfo}>
              <Text>Moyenne: </Text>
              <Text
                style={[
                  s.moodValue,
                  { color: getColorFromMoodValue(selectedMood.value) },
                ]}
              >
                {selectedMood.value}
                {/* {String(selectedMood.moodValue).padStart(2, "0")} */}
              </Text>
              <Text style={{ color: "transparent" }}>Moyenne: </Text>
            </View>
            <View style={s.acces}>
              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  width: 80,
                  alignItems: "center",
                }}
                onPress={() => {
                  handleVoirMois();
                }}
              >
                <Text style={{ fontStyle: "italic" }}>Voir le mois</Text>
              </TouchableOpacity>
            </View>
          </>
        </View>
      )}
    </>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    grafInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      gap: 15,
      marginTop: 20,
      width: 350,
      height: 40,
      borderTopEndRadius: 8,
      borderStartStartRadius: 8,
      backgroundColor: colors.card,
    },
    grafContainer: {
      borderColor: colors.card,
      backgroundColor: colors.calendarBackground,
      borderTopWidth: 0,
      borderWidth: 4,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
      paddingTop: 10,
      paddingRight: 5,
      width: 350,
    },
    carte: {
      backgroundColor: colors.moodCard,
      marginTop: 10,
      borderWidth: 4,
      width: 350,
      height: 100,
      borderRadius: 8,
      paddingHorizontal: 7,
    },
    topCarte: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },
    exit: {
      width: 50,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    moodInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginTop: 5,
    },
    moodValue: {
      fontSize: 25,
    },
    com: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    acces: {
      alignItems: "flex-end",
      marginRight: 0,
    },
  });
