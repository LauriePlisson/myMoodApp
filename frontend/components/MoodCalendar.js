import { Calendar, LocaleConfig } from "react-native-calendars";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { X } from "lucide-react-native";

export default function MoodCalendar({ moods, onDaySelect }) {
  const [displayMood, setDisplayMood] = useState(false);
  const [selectedMood, setSelectedMood] = useState({});

  function formatLocalDate(dateString) {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }
  const markedDates = {};
  moods.forEach((mood) => {
    const localDate = formatLocalDate(mood.date);
    markedDates[localDate] = {
      customStyles: {
        container: {
          backgroundColor: getColorBackgroundFromMoodValue(mood.moodValue),
          borderRadius: 30,
          borderColor: getColorFromMoodValue(mood.moodValue),
          // width: 30,
          // height: 30,
          justifyContent: "center",
          alignItems: "center",
        },
        text: {
          color: getColorFromMoodValue(mood.moodValue),
        },
      },
    };
  });

  // Choisir une couleur selon la valeur du mood
  function getColorFromMoodValue(value) {
    if (!value) return "black";
    if (value <= 2) return "#d0094cff";
    if (value < 5) return "#rgba(185, 154, 114, 1)";
    if (value < 7) return "#rgba(143, 148, 3, 1)";
    return "#09d066ff";
  }

  function getColorBackgroundFromMoodValue(value) {
    if (!value) return "white";
    if (value <= 2) return "rgba(208, 9, 75, 0.42)";
    if (value < 5) return "#rgba(237, 155, 48, 0.42)";
    if (value < 7) return "#rgba(216, 239, 67, 0.42)";
    return "rgba(22, 240, 124, 0.42)";
  }
  const handleDaySelect = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setSelectedMood({ date: dateString, future: true });
      setDisplayMood(true);
      return;
    }

    const mood = moods.find((m) => formatLocalDate(m.date) === dateString);
    setSelectedMood(mood || { date: dateString, noMood: true });
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

  return (
    <View style={styles.container}>
      <Calendar
        markingType={"custom"}
        markedDates={markedDates}
        onDayPress={(day) => {
          handleDaySelect(day.dateString);
          setDisplayMood(true);
        }}
        style={styles.calendar}
        theme={{
          borderRadius: 8,
          todayTextColor: "#c10db5ff",
          textSectionTitleColor: "#fceaf0ff",
          monthTextColor: "white",
          selectedDayBackgroundColor: "#4a132fff",
          arrowColor: "#fceaf0ff",
        }}
      />
      {displayMood && (
        <View
          style={[
            styles.carte,
            {
              borderColor: getColorBackgroundFromMoodValue(
                selectedMood.moodValue
              ),
            },
          ]}
        >
          <View style={[styles.topCarte]}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: getColorFromMoodValue(selectedMood.moodValue),
                }}
              >
                Mood du:{" "}
              </Text>
              <Text style={{ fontSize: 15 }}>
                {new Date(selectedMood.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.exit}
              onPress={() => setDisplayMood(false)}
            >
              <X
                size={20}
                color={getColorFromMoodValue(selectedMood.moodValue)}
              />
            </TouchableOpacity>
          </View>
          {selectedMood.future ? (
            <Text style={{ marginTop: 10 }}>
              Ce jour n’est pas encore arrivé 🕒
            </Text>
          ) : selectedMood.noMood ? (
            <Text style={{ marginTop: 10 }}>Pas de mood pour ce jour 😶</Text>
          ) : (
            <>
              <View style={styles.moodInfo}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.moodValue,
                      { color: getColorFromMoodValue(selectedMood.moodValue) },
                    ]}
                  >
                    {String(selectedMood.moodValue).padStart(2, "0")}
                  </Text>
                </View>
                <View style={styles.com}>
                  <Text style={{ fontSize: 15, fontStyle: "italic" }}>
                    Comm:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    {selectedMood.note ? selectedMood.note : "Vide"}
                  </Text>
                  <Text style={{ opacity: 0 }}>Comm: </Text>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    marginTop: 30,
    gap: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  calendar: {
    borderRadius: 8,
    backgroundColor: "#d8becbff",
    paddingBottom: 5,
    width: 350,
  },
  carte: {
    backgroundColor: "white",
    borderWidth: 2,
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
    // height: 30,
    width: 50,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  moodInfo: {
    // flexDirection: "row",
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
