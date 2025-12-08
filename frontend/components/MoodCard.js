import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  getColorFromMoodValue,
  getColorBackgroundFromMoodValue,
} from "../utils/moodColors";
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

  return (
    <View
      style={[
        s.card,
        { borderColor: getColorFromMoodValue(selectedMood?.value) },
      ]}
    >
      <View style={s.sectionCard}>
        <View style={[s.date]}>
          <Text style={s.moodDate}>{selectedMood?.date}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            onCloseMood();
          }}
        >
          <X size={20} color={getColorFromMoodValue(selectedMood?.value)} />
        </TouchableOpacity>
      </View>
      {selectedMood.value !== null ? (
        <View style={s.midCard}>
          <View style={[s.sectionCard, s.noteSection]}>
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
              style={[
                s.note,
                { color: getColorFromMoodValue(selectedMood?.value) },
              ]}
            >
              {String(selectedMood?.value).padStart(2, "0")}
            </Text>
            <Text style={{ color: "transparent" }}>Moyenne:</Text>
          </View>
          {period === "mois" || isCalendar ? (
            <View>
              <View style={[s.comSection]}>
                <Text style={s.com}>{selectedMood?.note}</Text>
              </View>
              {isCalendar && (
                <View
                  style={{
                    width: 320,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      s.button,
                      {
                        backgroundColor: getColorFromMoodValue(
                          selectedMood?.value
                        ),
                      },
                    ]}
                    onPress={() => setModalVisible(true)}
                  >
                    <Pencil size={20} color={colors.whiteBlack} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View
              style={[
                // s.sectionCard,
                // s.acces,
                {
                  // borderWidth: 2,
                  marginTop: 21,
                  width: 310,
                  justifyContent: "center",
                  alignItems: "flex-end",
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  s.button,
                  {
                    backgroundColor: getColorFromMoodValue(selectedMood?.value),
                  },
                ]}
                onPress={() => {
                  handleVoirMois();
                }}
              >
                <ChartNoAxesCombined size={20} color={colors.whiteBlack} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <>
          <View style={[s.noData]}>
            <Text style={{ color: colors.textGeneral }}>
              Pas de donnée pour{" "}
              {period === "mois" || isCalendar ? "ce jour" : "ce mois"}
            </Text>
          </View>
          {selectedMood.past && isCalendar && (
            <View
              style={[
                {
                  marginTop: 2,
                  width: 320,
                  justifyContent: "center",
                  alignItems: "flex-end",
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  s.button,
                  {
                    backgroundColor: getColorFromMoodValue(selectedMood?.value),
                  },
                ]}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Plus
                  size={20}
                  color={colors.whiteBlack}
                  style={{ fontWeight: "bold" }}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
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
    button: {
      width: 35,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      height: 30,
    },
  });
