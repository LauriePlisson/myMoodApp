import { Calendar, LocaleConfig } from "react-native-calendars";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useMemo } from "react";

export default function MoodCalendar({
  moods,
  selectedDate,
  setSelectedDate,
  loadYear,
}) {
  const [displayMood, setDisplayMood] = useState(false);
  const [selectedMood, setSelectedMood] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme } = useTheme();
  const { colors } = useTheme();
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
  const handleDaySelect = (dateString) => {
    const selectedLocal = new Date(dateString);
    selectedLocal.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedLocal > today) {
      setSelectedMood({ date: dateString, future: true });
      setDisplayMood(true);
      return;
    }

    const moodsForYear = moods[selectedDate.getFullYear()] || [];

    const mood = moodsForYear.find((m) => {
      const moodLocal = new Date(m.date);
      moodLocal.setHours(0, 0, 0, 0);
      return moodLocal.getTime() === selectedLocal.getTime();
    });

    setSelectedMood(mood || { date: dateString, noMood: true });
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
    monthNamesShort: [
      "Janv.",
      "Févr.",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juil.",
      "Août",
      "Sept.",
      "Oct.",
      "Nov.",
      "Déc.",
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
      monthTextColor: colors.grafText,
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
          handleDaySelect(day.dateString);
          setDisplayMood(true);
        }}
        onMonthChange={(month) => {
          handleChangeMonth(month);
        }}
        style={s.calendar}
        theme={calendarTheme}
      />
      {displayMood && (
        <View
          style={[
            s.carte,
            {
              borderColor: getColorBackgroundFromMoodValue(
                selectedMood.moodValue
              ),
            },
          ]}
        >
          <View style={[s.topCarte]}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: getColorFromMoodValue(selectedMood.moodValue),
                }}
              >
                Mood du:{" "}
              </Text>
              <Text style={{ fontSize: 15, color: colors.text }}>
                {new Date(selectedMood.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </Text>
            </View>
            <TouchableOpacity
              style={s.exit}
              onPress={() => setDisplayMood(false)}
            >
              <X
                size={20}
                color={getColorFromMoodValue(selectedMood.moodValue)}
              />
            </TouchableOpacity>
          </View>
          {selectedMood.future ? (
            <Text style={{ marginTop: 10, color: colors.text }}>
              Ce jour n’est pas encore arrivé 🕒
            </Text>
          ) : selectedMood.noMood ? (
            <Text style={{ marginTop: 10, color: colors.text }}>
              Pas de mood pour ce jour 😶
            </Text>
          ) : (
            <>
              <View style={s.moodInfo}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      s.moodValue,
                      { color: getColorFromMoodValue(selectedMood.moodValue) },
                    ]}
                  >
                    {String(selectedMood.moodValue).padStart(2, "0")}
                  </Text>
                </View>
                {selectedMood.note ? (
                  <View style={s.com}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontStyle: "italic",
                        color: colors.text,
                      }}
                    >
                      Comm:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        color: colors.text,
                      }}
                    >
                      {selectedMood.note}
                    </Text>
                    <Text style={{ opacity: 0 }}>Comm: </Text>
                  </View>
                ) : (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text>Pas de commentaire</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
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
      backgroundColor: colors.card,
      paddingBottom: 5,
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
