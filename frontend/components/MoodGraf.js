import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";
import { getMoodColor } from "../utils/moodColors";

export default function MoodGraf({
  moods,
  moodsByYear,
  period,
  selectedDate,
  setSelectedDate,
  loadYear,
  onMoodPress,
  closeMoodCard,
}) {
  const { colors } = useTheme();
  const s = styles(colors);

  const selectedMood = useSelector((state) => state.moods.selectedMood);

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

  //nombre de "point"
  let length;
  if (period === "mois") {
    // nombre de jours exact du mois sélectionné
    length = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
    ).getDate();
  } else {
    length = 12; // 12 mois
  }

  const getIndex = (m) => {
    if (period === "mois") {
      return m.label - 1; //  on passe de 1→31 à 0→30
    }
    return m.label; // année (0→11)
  };

  //  tableau initial avec toutes les dates
  const data = Array.from({ length }, (_, i) => {
    let date;
    if (period === "mois") {
      date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i + 1,
      );
      return {
        value: null,
        label: i + 1, // pour les jours du mois, 1-31
        note: "",
        date: date.toISOString(),
        fullMood: null,
      };
    } else {
      date = new Date(selectedDate.getFullYear(), i, 1);
      return {
        value: null,
        label: i, // 0→11 pour Janvier-Décembre
        note: "",
        date: date.toISOString(),
        fullMood: null,
      };
    }
  });

  // remplit les moods existants
  moods.forEach((mood) => {
    const index = getIndex(mood);
    if (index >= 0 && index < length) {
      data[index] = {
        value: mood.value,
        label: mood.label,
        date: mood.fullMood
          ? new Date(mood.fullMood.date).toISOString()
          : (mood.date ?? data[index].date),
        note: mood.fullMood?.note || "",
        fullMood: mood.fullMood || null,
      };
    }
  });

  // jours avant le premier mood value = 0
  let firstDataIndex = data.findIndex((d) => d.value !== null);
  if (firstDataIndex === -1) firstDataIndex = length; // aucun mood saisi
  for (let i = 0; i < firstDataIndex; i++) {
    data[i].value = 0;
  }

  // pas de point apres le dernier mood enregistre
  let lastIndex = data.length - 1;
  while (lastIndex >= 0 && data[lastIndex].value === null) {
    lastIndex--;
  }
  const trimmedData = data.slice(0, lastIndex + 1);

  // clone pour le graf
  const clonedData = trimmedData.map((d) => ({
    ...d,
    fullMood: d.fullMood ? { ...d.fullMood } : null,
  }));

  const handleFocus = (mood) => {
    const month = moisEnLettre(mood.label);
    const dateAffichee = `${moisEnLettre(
      mood.label,
    )} ${selectedDate.getFullYear()}`;
    if (period === "annee") {
      if (mood.label !== null) {
        onMoodPress({
          label: `${month}`,
          value: mood.value || null,
          month: mood.label,
          date: dateAffichee,
          note: "",
        });
      } else {
        onMoodPress({ value: null });
      }
    }
    if (period === "mois") {
      if (mood.fullMood) {
        onMoodPress({
          value: mood.value,
          label: mood.label,
          date: formatDate(mood.fullMood.date),
          note: mood.fullMood.note,
          fullMood: mood.fullMood,
          dateString: mood.fullMood.date,
        });
      } else {
        onMoodPress({
          value: null,
          label: mood.label,
          date: formatDate(mood.date),
          note: null,
          dateString: mood.date,
        });

        return;
      }
    }
  };

  const chartWidth = 290;
  const spacing = chartWidth / (clonedData.length - 1 || 1);

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
    closeMoodCard();
    if (period === "mois") {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevYear = prevMonth.getFullYear();
      setSelectedDate(prevMonth);
      if (!moodsByYear[prevYear]) {
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
    closeMoodCard();
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
      <View style={s.grafHeader}>
        <View style={s.grafInfo}>
          <TouchableOpacity
            style={s.chevron}
            onPress={() => handleChevronLeft()}
          >
            <ChevronLeft color={colors.whiteWhite} />
          </TouchableOpacity>
          <Text style={s.grafText}>{displayPeriod}</Text>
          <TouchableOpacity
            style={s.chevron}
            onPress={() => handleChevronRight()}
          >
            <ChevronRight color={colors.whiteWhite} />
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 300,
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 15,
              width: 80,
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
              borderColor: colors.buttonBackground,
            }}
          >
            <Text style={{ color: colors.buttonBackground }}>Comparer</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={s.grafContainer}>
        <LineChart
          data={clonedData}
          height={220}
          width={chartWidth}
          spacing={spacing}
          initialSpacing={0}
          rulesColor="#e9d5e3ff"
          hideYAxisText={false}
          hideDataPoints={false}
          showVerticalLines={false}
          yAxisThickness={2}
          xAxisThickness={2}
          yAxisTextStyle={{
            color: colors.buttonBackground,
            fontSize: 12,
            fontWeight: "300",
          }}
          yAxisLabelWidth={20}
          yAxisColor={colors.axesColor}
          xAxisLabelsHeight={7}
          xAxisLabelTextStyle={{ color: "transparent" }}
          xAxisColor={colors.axesColor}
          minValue={0}
          maxValue={10}
          noOfSections={10}
          color={colors.courbeColor}
          curved={false}
          // curvature={0.015}
          thickness={2}
          areaChart
          startFillColor={colors.startFill}
          endFillColor={colors.endFill}
          startOpacity={0.4}
          endOpacity={0.1}
          focusEnabled={true}
          dataPointsRadius={6}
          dataPointsColor={colors.dotColor}
          unFocusOnPressOut={false}
          focusedDataPointColor={
            selectedMood ? getMoodColor(selectedMood.value) : colors.dotColor
          }
          onFocus={(mood) => {
            handleFocus(mood);
          }}
        />
      </View>
    </>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    grafHeader: {
      justifyContent: "center",
      marginTop: 20,
      width: 350,
      height: 60,
      borderTopEndRadius: 8,
      borderStartStartRadius: 8,
      backgroundColor: colors.cardBackground,
    },
    grafInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    chevron: {
      alignItems: "center",
      width: 20,
    },
    grafText: {
      fontSize: 18,
      color: colors.buttonBackground,
      fontWeight: "500",
      width: 150,
      textAlign: "center",
    },
    grafContainer: {
      borderColor: colors.cardBackground,
      backgroundColor: colors.whiteBlack,
      borderTopWidth: 0,
      borderWidth: 4,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
      paddingTop: 10,
      paddingRight: 5,
      width: 350,
    },
  });
