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
import {
  getColorFromMoodValue,
  getColorBackgroundFromMoodValue,
} from "../utils/moodColors";
import MoodCard from "./MoodCard";

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

  function formatDate(dateString) {
    const date = new Date(dateString); // convertit UTC → date locale automatiquement
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const length = period === "mois" ? 31 : 12;
  const getIndex = (m) => {
    if (period === "mois") {
      return m.label - 1; // ⬅️ on passe de 1→31 à 0→30
    }
    return m.label; // année reste inchangé (0→11)
  };

  const data = Array.from({ length }, (_, i) => ({
    value: null,
    label: "",
    date: null,
    fullMood: null,
  }));

  moods.forEach((mood) => {
    const index = getIndex(mood);
    if (index >= 0 && index < length) {
      data[index] = {
        value: mood.value,
        label: mood.label,
        fullMood: mood.fullMood,
      };
    }
  });

  const handleFocus = (mood) => {
    setDisplayMood(true);
    const month = moisEnLettre(mood.label);
    if (period === "annee") {
      if (mood.label) {
        setSelectedMood({
          label: `${month}`,
          value: mood.value,
          month: mood.label,
          date: `${month}`,
          note: "",
        });
      } else {
        setSelectedMood({
          value: null,
        });
      }
    }
    if (period === "mois") {
      if (mood.fullMood) {
        setSelectedMood({
          value: mood.value,
          label: mood.label,
          date: formatDate(mood.fullMood.date),
          note: mood.fullMood.note,
        });
      } else {
        setSelectedMood({
          value: null,
          label: mood.label,
          date: null,
          note: null,
        });

        return;
      }
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
    setDisplayMood(false);
    if (period === "mois") {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevYear = prevMonth.getFullYear();
      setSelectedDate(prevMonth);
      if (!moods[prevYear]) {
        loadYear(prevYear);
      }
    }
    if (period === "annee") {
      const prevYearDate = new Date(selectedDate);
      const prevYear = prevYearDate.getFullYear() - 1;

      setSelectedDate(new Date(prevYear, 0, 1));
      loadYear(prevYear);
    }
  };

  const handleChevronRight = () => {
    setDisplayMood(false);
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
        <TouchableOpacity style={s.chevron} onPress={() => handleChevronLeft()}>
          <ChevronLeft color={colors.grafText} />
        </TouchableOpacity>
        <Text style={s.grafText}>{displayPeriod}</Text>
        <TouchableOpacity
          style={s.chevron}
          onPress={() => handleChevronRight()}
        >
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
          rulesColor={colors.textAccent}
          hideYAxisText={false}
          hideDataPoints={false}
          showVerticalLines={false}
          yAxisThickness={2}
          xAxisThickness={2}
          yAxisTextStyle={{
            color: colors.textAccent,
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
          startFillColor="rgba(245, 123, 190, 1)" //"rgba(237, 132, 184, 0.3)" // début du dégradé
          endFillColor="#d1d8f2ff" //"rgba(216, 190, 190, 0)" // fin du dégradé (transparent)
          startOpacity={0.4}
          endOpacity={0.1}
          dataPointsRadius={5}
          dataPointLabelRadius={15}
          dataPointsColor="#D8BECB"
          focusEnabled={true}
          focusedDataPointColor={getColorFromMoodValue(selectedMood.value)} // couleur a changer
          onFocus={(mood) => handleFocus(mood)}
        />
      </View>
      {displayMood && (
        <MoodCard
          selectedMood={selectedMood}
          period={period}
          selectedDate={selectedDate}
          handleVoirMois={handleVoirMois}
          setDisplayMood={setDisplayMood}
        />
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
      marginTop: 20,
      width: 350,
      height: 40,
      borderTopEndRadius: 8,
      borderStartStartRadius: 8,
      backgroundColor: colors.cardBackground,
    },
    chevron: {
      alignItems: "center",
      width: 20,
    },
    grafText: {
      fontSize: 15,
      color: colors.grafText,
      width: 150,
      textAlign: "center",
    },
    grafContainer: {
      borderColor: colors.cardBackground,
      backgroundColor: colors.white,
      borderTopWidth: 0,
      borderWidth: 4,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
      paddingTop: 10,
      paddingRight: 5,
      width: 350,
    },
  });
