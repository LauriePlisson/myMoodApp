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
}) {
  const [displayMood, setDisplayMood] = useState(false);
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
    // onPress: () => {},
    // dataPointLabelComponent: () => <></>,
  }));

  moods.forEach((mood) => {
    const index = getIndex(mood);
    if (index >= 0 && index < length) {
      data[index] = {
        value: mood.value,
        label: mood.label,
        // onPress: () => {
        //   setDisplayMood(true);
        //   if (period === "annee") {
        //     const month = moisEnLettre(mood.label);
        //     setSelectedMood({
        //       label: `${month}`,
        //       value: mood.value,
        //     });
        //   }
        //   console.log(
        //     `Index ${index}: valeur ${mood.value} date ${mood.label}`
        //   );
        // },
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
  }

  const handleChevronLeft = () => {
    if (period === "mois") {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(selectedDate.getMonth() - 1);
      setSelectedDate(prevMonth);
    }
    if (period === "annee") {
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
    if (period === "annee") {
      const nextYear = new Date(selectedDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setSelectedDate(nextYear);
    }
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
          onFocus={(data) => console.log(data)}
        />
      </View>
      {displayMood && (
        <View
          style={[
            s.carte,
            // {
            //   borderColor: getColorBackgroundFromMoodValue(
            //     selectedMood.moodValue
            //   ),
            // },
          ]}
        >
          <View style={[s.topCarte]}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 15, color: colors.text }}>
                {selectedMood.label}
                {/* {new Date(selectedMood.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })} */}
              </Text>
            </View>
            <TouchableOpacity
              style={s.exit}
              onPress={() => setDisplayMood(false)}
            >
              <X
                size={20}
                // color={getColorFromMoodValue(selectedMood.moodValue)}
              />
            </TouchableOpacity>
          </View>

          <>
            <View style={s.moodInfo}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    s.moodValue,
                    // { color: getColorFromMoodValue(selectedMood.moodValue) },
                  ]}
                >
                  moyenne: {selectedMood.value}
                  {/* {String(selectedMood.moodValue).padStart(2, "0")} */}
                </Text>
              </View>
              {/* {selectedMood.note ? ( */}
              {/* )} */}
            </View>
          </>
        </View>
      )}
    </>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    // container: {
    //   alignItems: "center",
    //   justifyContent: "flex-end",
    //   //   paddingVertical: 10,
    //   //   width: 350,
    //   //   height: 300,
    //   //   backgroundColor: colors.grafBackColor,
    //   //   borderRadius: 15,
    //   //   gap: 5,
    // },
    grafInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      gap: 15,
      marginTop: 20,
      width: 350,
      height: 40,
      // marginBottom: 10,
      borderTopEndRadius: 8,
      borderStartStartRadius: 8,
      backgroundColor: colors.card,
    },
    grafContainer: {
      borderColor: colors.card,
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
      alignItems: "center",
    },
    moodValue: {
      fontSize: 25,
      marginBottom: 5,
    },
    com: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
  });
