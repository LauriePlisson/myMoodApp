import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  getColorFromMoodValue,
  getColorBackgroundFromMoodValue,
} from "../utils/moodColors";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedMood } from "../reducers/moods";
import { X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function MoodCard({
  setModalVisible,
  handleVoirMois,
  period,
  setSelectedDateString,
  isCalendar,
  onCloseMood,
}) {
  const { theme, colors } = useTheme();
  const s = styles(colors);

  const selectedMood = useSelector((state) => state.moods.selectedMood);
  const dispatch = useDispatch();

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: getColorBackgroundFromMoodValue(selectedMood.value),
        },
        { borderColor: getColorFromMoodValue(selectedMood.value) },
      ]}
    >
      <View style={s.sectionCard}>
        <View
          style={[
            s.date,
            {
              opacity: selectedMood.value !== null ? 1 : 0,
            },
          ]}
        >
          <Text style={s.moodDate}>{selectedMood.date}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            onCloseMood();
            if (setSelectedDateString) setSelectedDateString("");
          }}
        >
          <X size={20} color={getColorFromMoodValue(selectedMood.value)} />
        </TouchableOpacity>
      </View>
      {selectedMood.value !== null ? (
        <View style={s.midCard}>
          <View style={[s.sectionCard, s.noteSection]}>
            <Text
              style={{
                color: period === "mois" ? "transparent" : colors.textGeneral,
              }}
            >
              Moyenne:
            </Text>
            <Text
              style={[
                s.note,
                { color: getColorFromMoodValue(selectedMood.value) },
              ]}
            >
              {String(selectedMood.value).padStart(2, "0")}
            </Text>
            <Text style={{ color: "transparent" }}>Moyenne:</Text>
          </View>
          {period === "mois" ? (
            <>
              <View style={s.comSection}>
                <Text style={s.com}>{selectedMood.note}</Text>
              </View>
              {isCalendar && (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text>Modifier le Mood</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={[s.sectionCard, s.acces]}>
              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  borderColor: colors.textMyMood,
                  width: 80,
                  alignItems: "center",
                }}
                onPress={() => {
                  handleVoirMois();
                }}
              >
                <Text style={{ fontStyle: "italic", color: colors.textMyMood }}>
                  Voir le mois
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={[s.noData]}>
          <Text style={{ color: colors.textGeneral }}>
            Pas de donnée pour{" "}
            {period === "mois" && selectedMood.date
              ? `le ${selectedMood.date}`
              : period === "annee"
              ? "ce mois"
              : "ce jour"}
          </Text>
          {selectedMood.past && !selectedMood.future && (
            <TouchableOpacity
              style={s.addButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Text style={s.addButtonText}>Ajouter un mood</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    card: {
      borderWidth: 2,
      borderRadius: 8,
      width: 350,
      height: 100,
      marginTop: 10,
      justifyContent: "flex-start",
      backgroundColor: colors.whiteBlack,
      paddingTop: 5,
      paddingHorizontal: 10,
    },
    sectionCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    midCard: {
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 5,
      height: 70,
    },
    date: {
      flexDirection: "row",
    },
    noteSection: {
      paddingHorizontal: 30,
      width: 350,
      marginTop: 5,
      marginBottom: 2,
    },
    comSection: {
      justifyContent: "center",
      alignItems: "center",
    },
    moodDate: {
      fontWeight: "500",
      color: colors.textGeneral,
    },
    acces: {
      justifyContent: "flex-end",
      paddingHorizontal: 30,
      marginTop: 10,
      width: 350,
    },
    noData: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    note: {
      fontSize: 20,
      fontWeight: "bold",
    },
    com: {
      fontSize: 15,
      color: colors.textGeneral,
    },
  });
