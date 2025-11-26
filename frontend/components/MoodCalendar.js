import { Calendar, LocaleConfig } from "react-native-calendars";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import {
  getColorFromMoodValue,
  getColorBackgroundFromMoodValue,
} from "../utils/moodColors";
import { useTheme } from "../context/ThemeContext";
import { useMemo } from "react";
import MoodCard from "./MoodCard";

export default function MoodCalendar({
  moods,
  selectedDate,
  setSelectedDate,
  loadYear,
}) {
  const [displayMood, setDisplayMood] = useState(false);
  const [selectedMood, setSelectedMood] = useState({});
  const [selectedDateString, setSelectedDateString] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, colors } = useTheme();
  const s = styles(colors);

  const year = selectedDate.getFullYear();
  const moodsForCalendar = moods[year] || [];

  function formatLocalDate(dateString) {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }

  const markedDates = {};

  moodsForCalendar.forEach((mood) => {
    const localDate = formatLocalDate(mood.date);
    markedDates[localDate] = {
      customStyles: {
        container: {
          backgroundColor: getColorBackgroundFromMoodValue(mood.moodValue),
          borderRadius: 30,
          borderColor: getColorFromMoodValue(mood.moodValue),
          justifyContent: "center",
          alignItems: "center",
        },
        text: {
          color: getColorFromMoodValue(mood.moodValue),
        },
      },
    };
  });

  if (selectedDateString) {
    markedDates[selectedDateString] = {
      ...(markedDates[selectedDateString] || {}), // si déjà un mood : on garde les styles
      customStyles: {
        ...(markedDates[selectedDateString]?.customStyles || {}),
        container: {
          ...(markedDates[selectedDateString]?.customStyles?.container || {}),
          borderWidth: 2,
          borderColor: getColorFromMoodValue(selectedMood.value), // couleur d'entourage du jour sélectionné
          justifyContent: "center",
          alignItems: "center",
        },
        text: {
          ...(markedDates[selectedDateString]?.customStyles?.text || {}),
          color: getColorFromMoodValue(selectedMood.value),
          fontWeight: "500",
        },
      },
    };
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

    // if (selectedLocal > today) {
    //   setSelectedMood({ date: dateString, future: true });
    //   setDisplayMood(true);
    //   return;
    // }

    const moodsForYear = moods[selectedDate.getFullYear()] || [];

    const mood = moodsForYear.find((m) => {
      const moodLocal = new Date(m.date);
      moodLocal.setHours(0, 0, 0, 0);
      return moodLocal.getTime() === selectedLocal.getTime();
    });
    if (!mood) {
      setSelectedMood({ value: null });
    } else
      setSelectedMood({
        value: mood.moodValue,
        date: formatDate(mood.date),
        note: mood.note,
      });
    setDisplayMood(true);
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

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

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
      backgroundColor: colors.background,
      calendarBackground: colors.calendarBackground,
      textSectionTitleColor: "white",
      dayTextColor: colors.text,
      textDisabledColor: colors.otherdays,
      monthTextColor: colors.simple,
      arrowColor: colors.accent,
      todayTextColor: colors.accent,
      selectedDayBackgroundColor: colors.primary,
      selectedDayTextColor: colors.primary,
    }),
    [theme]
  );

  return (
    <>
      <Calendar
        key={refreshKey}
        markingType={"custom"}
        markedDates={markedDates}
        onDayPress={(day) => {
          setSelectedDateString(day.dateString);
          handleDaySelect(day.dateString);
        }}
        onMonthChange={(month) => {
          handleChangeMonth(month);
        }}
        style={s.calendar}
        theme={calendarTheme}
      />
      {displayMood && (
        <MoodCard
          selectedMood={selectedMood}
          setDisplayMood={setDisplayMood}
          period={"mois"}
        />
      )}
    </>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    container: {
      // height: 350,
      // width: 350,
      marginTop: 30,
      gap: 15,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    calendar: {
      borderRadius: 8,
      backgroundColor: colors.contourGrafCal,
      paddingBottom: 5,
      width: 350,
    },
  });
