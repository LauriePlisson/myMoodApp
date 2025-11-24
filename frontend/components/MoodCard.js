import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function MoodCard({
  setDisplayMood,
  selectedMood,
  handleVoirMois,
  period,
}) {
  const { theme, colors } = useTheme();
  const s = styles(colors);
  return (
    <View style={s.card}>
      <View style={s.sectionCard}>
        <View style={s.date}>
          <Text>Mood du: </Text>
          <Text>{selectedMood.date}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setDisplayMood(false);
          }}
        >
          <X size={20} />
        </TouchableOpacity>
      </View>
      <View style={s.midCard}>
        <View style={[s.sectionCard, s.noteSection]}>
          <Text style={{ color: period === "mois" ? "transparent" : "black" }}>
            Moyenne:
          </Text>
          <Text style={s.note}>
            {String(selectedMood.value).padStart(2, "0")}
          </Text>
          <Text style={{ color: "transparent" }}>Moyenne:</Text>
        </View>
        {period === "mois" && (
          <View style={s.comSection}>
            <Text style={s.com}>{selectedMood.note}</Text>
          </View>
        )}
        {period === "annee" && (
          <View style={[s.sectionCard, s.acces]}>
            <TouchableOpacity
              style={{
                borderBottomWidth: 1,
                width: 80,
                alignItems: "center",
              }}
              onPress={() => {
                handleVoirMois();
              }}
            >
              <Text style={{ fontStyle: "italic" }}>Voir le mois</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
      backgroundColor: "white",
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    sectionCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    midCard: {
      justifyContent: "center",
      height: 70,
      gap: 10,
    },
    date: {
      flexDirection: "row",
    },
    noteSection: {
      paddingHorizontal: 30,
    },
    comSection: {
      justifyContent: "center",
      alignItems: "center",
    },
    acces: {
      //   borderWidth: 2,
      justifyContent: "flex-end",
      paddingHorizontal: 30,
    },
  });
