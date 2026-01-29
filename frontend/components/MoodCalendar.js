import { Calendar, LocaleConfig } from "react-native-calendars";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MoodRing from "./MoodRing";
import { getMoodColor, getMoodBackgroundColor } from "../utils/moodColors";
import { useTheme } from "../context/ThemeContext";
import { useMemo } from "react";

export default function MoodCalendar({
  moods,
  selectedDate,
  setSelectedDate,
  loadYear,
  onMoodPress,
}) {
  // const [refreshKey, setRefreshKey] = useState(0);
  const { theme, colors } = useTheme();
  const s = styles(colors);

  const selectedMood = useSelector((state) => state.moods.selectedMood);

  // useEffect(() => {
  //   setRefreshKey((prev) => prev + 1);
  // }, [moods]);

  const year = selectedDate.getFullYear();
  const moodsForCalendar = moods[year] || [];

  function formatLocalDate(dateString) {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }

  function formatDate(dateString) {
    const date = new Date(dateString); // convertit UTC → date locale automatiquement
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleDaySelect = (dateString) => {
    const selectedLocal = new Date(dateString);
    selectedLocal.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isFuture = selectedLocal > today;
    const isPast = selectedLocal < today;

    const moodsForYear = moods[selectedDate.getFullYear()] || [];

    const mood = moodsForYear.find((m) => {
      const moodLocal = new Date(m.date);
      moodLocal.setHours(0, 0, 0, 0);
      return moodLocal.getTime() === selectedLocal.getTime();
    });

    const newSelectedMood = mood
      ? {
          value: mood.moodValue,
          date: formatDate(mood.date),
          note: mood.note,
          dateString,
          fullMood: mood,
        }
      : {
          value: null,
          date: formatDate(dateString),
          note: "",
          dateString,
          fullMood: null,
        };

    onMoodPress(newSelectedMood);
  };

  LocaleConfig.locales["fr"] = {
    monthNames: [
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
    ],
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  };
  LocaleConfig.defaultLocale = "fr";

  const handleChangeMonth = (month) => {
    const newDate = new Date(month.year, month.month - 1, 1);

    const year = newDate.getFullYear();
    if (!moods[year]) {
      loadYear(year);
    }

    setSelectedDate(newDate);
  };

  const calendarTheme = useMemo(
    () => ({
      calendarBackground: colors.whiteBlack,
      textSectionTitleColor: colors.whiteWhite,
      dayTextColor: colors.textMyMood,
      monthTextColor: colors.buttonBackground,
      textMonthFontWeight: "500",
      arrowColor: colors.whiteWhite,
      disabledArrowColor: colors.whiteWhite,
      todayTextColor: colors.textAccent,
      // todayBackgroundColor: colors.inputBackground,
      textDisabledColor: colors.textGeneral,
    }),
    [theme],
  );

  return (
    <Calendar
      onMonthChange={(month) => {
        handleChangeMonth(month);
      }}
      style={s.calendar}
      theme={calendarTheme}
      dayComponent={({ date, state }) => {
        const dateString = date.dateString;
        const mood = moodsForCalendar.find(
          (m) => formatLocalDate(m.date) === dateString,
        );
        const moodValue = mood ? mood.moodValue : null;
        const isSelected = selectedMood?.dateString === dateString;

        // Déterminer si le jour est du mois courant
        const isCurrentMonth = state !== "disabled";

        // Alpha différent pour mois courant vs autres mois
        const backgroundAlpha = isCurrentMonth ? 0.25 : 0.12;
        const accentOpacity = isCurrentMonth ? 1 : 0.45;

        return (
          <TouchableOpacity
            onPress={() => handleDaySelect(dateString)}
            style={{
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                moodValue !== null &&
                getMoodBackgroundColor(moodValue, backgroundAlpha),
              borderRadius: 50,
              // borderColor: getMoodColor(moodValue),
              margin: 0,
              padding: 0,
            }}
          >
            {moodValue !== null && (
              <MoodRing
                value={moodValue}
                size={30}
                strokeWidth={isSelected ? 3.5 : 3}
                color={getMoodColor(moodValue)}
                opacity={accentOpacity}
              />
            )}
            <Text
              style={{
                fontSize: 15,
                color: getMoodColor(moodValue),
                opacity: accentOpacity,
                fontWeight: isSelected ? "bold" : "400",
              }}
            >
              {date.day}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = (colors) =>
  StyleSheet.create({
    calendar: {
      borderRadius: 8,
      backgroundColor: colors.cardBackground,
      paddingBottom: 5,
      width: 350,
    },
  });
