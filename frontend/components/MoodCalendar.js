import { Calendar, LocaleConfig } from "react-native-calendars";
import { View, Text, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedMood } from "../reducers/moods";
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
  setModalVisible,
}) {
  const [displayMood, setDisplayMood] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, colors } = useTheme();
  const s = styles(colors);

  const dispatch = useDispatch();
  const selectedMood = useSelector((state) => state.moods.selectedMood);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      // l'écran n'est plus actif → on ferme la MoodCard
      setDisplayMood(false);
      setSelectedDateString("");
    }
  }, [isFocused]);

  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [moods]);

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
          borderRadius: 50,
          // borderWidth: 1,
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

    const isFuture = selectedLocal > today;
    const isPast = selectedLocal < today;

    const moodsForYear = moods[selectedDate.getFullYear()] || [];

    const mood = moodsForYear.find((m) => {
      const moodLocal = new Date(m.date);
      moodLocal.setHours(0, 0, 0, 0);
      return moodLocal.getTime() === selectedLocal.getTime();
    });

    // FORCER le dispatch même si c’est le même jour/même valeur
    const newSelectedMood = mood
      ? {
          value: mood.moodValue,
          date: formatDate(mood.date),
          note: mood.note,
          past: isPast,
          future: isFuture,
          dateString,
          fullMood: mood,
        }
      : {
          value: null,
          date: formatDate(dateString),
          note: "",
          past: isPast,
          future: isFuture,
          dateString,
          fullMood: null,
        };

    dispatch(setSelectedMood({ ...newSelectedMood, __force: Math.random() }));
    setDisplayMood(true);
    setSelectedDateString(dateString);
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
          setDisplayMood={setDisplayMood}
          period={"mois"}
          setSelectedDateString={setSelectedDateString}
          setModalVisible={setModalVisible}
          isCalendar={true}
        />
      )}
    </>
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
