import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getMoodBackgroundColor, getMoodColor } from "../utils/moodColors";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Pencil,
  ChartLine,
  ChartNoAxesCombined,
  ChartColumn,
  Plus,
} from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";

export default function MoodCard({
  setModalVisible,
  handleVoirMois,
  period,
  isCalendar,
  onCloseMood,
}) {
  const { theme, colors } = useTheme();
  const s = styles(colors);

  const selectedMood = useSelector((state) => state.moods.selectedMood);
  const dispatch = useDispatch();

  const isFuture = new Date(selectedMood?.dateString) > new Date();

  return (
    <View style={[s.card, { borderColor: getMoodColor(selectedMood?.value) }]}>
      <View style={s.header}>
        <Text style={s.moodDate}>{selectedMood?.date}</Text>
        <TouchableOpacity
          onPress={() => {
            onCloseMood();
          }}
        >
          <X size={20} color={getMoodColor(selectedMood?.value)} />
        </TouchableOpacity>
      </View>
      <View style={s.midCard}>
        {selectedMood.value !== null ? (
          <View style={s.noteSection}>
            <Text
              style={{
                color:
                  period === "mois" || isCalendar
                    ? "transparent"
                    : colors.textGeneral,
              }}
            >
              Moyenne:
            </Text>
            <Text
              style={[s.note, { color: getMoodColor(selectedMood?.value) }]}
            >
              {String(selectedMood?.value).padStart(2, "0")}
            </Text>
            <Text style={{ color: "transparent" }}>Moyenne:</Text>
          </View>
        ) : (
          <View style={[s.noData]}>
            <Text style={{ color: colors.textGeneral }}>
              Pas de donnée pour{" "}
              {period === "mois" || isCalendar ? "ce jour" : "ce mois"}
            </Text>
          </View>
        )}
        {selectedMood.note && (
          <View style={[s.comSection]}>
            <Text style={s.com}>{selectedMood?.note}</Text>
          </View>
        )}
      </View>

      {!isFuture && (
        <View style={s.buttonSection}>
          {period === "mois" || isCalendar ? (
            <TouchableOpacity
              style={[
                s.button,
                {
                  backgroundColor: getMoodColor(selectedMood?.value),
                },
              ]}
              onPress={() => setModalVisible(true)}
            >
              {selectedMood.value !== null ? (
                <Pencil size={20} color={colors.whiteBlack} />
              ) : (
                <Plus
                  size={20}
                  color={colors.whiteBlack}
                  style={{ fontWeight: "bold" }}
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                s.button,
                {
                  backgroundColor: getMoodBackgroundColor(selectedMood?.value),
                },
              ]}
              onPress={() => {
                handleVoirMois();
              }}
            >
              <ChartNoAxesCombined size={20} color={colors.whiteBlack} />
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    midCard: {
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      marginTop: 2,
      height: 50,
    },
    noteSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: 320,
    },
    comSection: {
      justifyContent: "center",
      alignItems: "center",
    },
    moodDate: {
      fontWeight: "500",
      color: colors.textGeneral,
    },
    noData: {
      // height: 50,
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
    buttonSection: {
      width: 320,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    button: {
      width: 35,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      height: 30,
    },
  });
