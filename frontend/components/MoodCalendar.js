import { Calendar, LocaleConfig } from "react-native-calendars";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MoodCalendar({ moods, onDaySelect }) {
  // Transforme les moods en objet marqué pour le calendrier
  const markedDates = {};
  moods.forEach((mood) => {
    const date = new Date(mood.date).toISOString().split("T")[0];
    markedDates[date] = {
      marked: true,
      dotColor: getColorFromMoodValue(mood.moodValue),
    };
  });

  // Choisir une couleur selon la valeur du mood
  function getColorFromMoodValue(value) {
    if (value <= 3) return "red";
    if (value <= 6) return "orange";
    return "green";
  }

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

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          if (onDaySelect) onDaySelect(day.dateString);
        }}
        theme={{
          todayTextColor: "#f8e8f7ff",
          dotColor: "#d8becbff",
          selectedDayBackgroundColor: "#d8becbff",
          arrowColor: "#d8becbff",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});
