import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import MoodCalendar from "../components/MoodCalendar";
import MoodGraf from "../components/MoodGraf";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Dimensions } from "react-native";
import MoodGraftest from "../components/MoodGraftest";

export default function HistoryScreen() {
  const [moodsData, setMoodsData] = useState([]);
  const [viewCalendar, setViewCalendar] = useState(true);
  const [selectedMood, setSelectedMood] = useState({});
  const user = useSelector((state) => state.user.value);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const recupMoods = async () => {
      const res = await fetch(`${API_URL}/moods/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setMoodsData(data.moods);
    };
    recupMoods();
  }, [viewCalendar]);

  const handleDaySelect = (dateString) => {
    const mood = dataMoods.find(
      (m) => new Date(m.date).toISOString().split("T")[0] === dateString
    );
    setSelectedMood(mood || null);
  };

  //A MODIFIER POUR QUE QUAND ON APPUIE SUR UN BOUTON CA FILTRE PAR MOIS OU AN
  const data = [];
  moodsData.forEach((mood) => {
    data.push({ value: mood.moodValue, label: mood.date });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tes Moods</Text>
      <View style={styles.centre}>
        <View style={styles.options}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setViewCalendar(true)}
          >
            <Text style={styles.textOption}>Calendrier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setViewCalendar(false)}
          >
            <Text style={styles.textOption}>Graphique</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.display}>
          {viewCalendar ? (
            <MoodCalendar moods={moodsData} onDaySelect={handleDaySelect} />
          ) : (
            <>
              <View style={styles.filtres}>
                <TouchableOpacity style={styles.filtre}>
                  <Text>Semaine</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filtre}>
                  <Text>Mois</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filtre}>
                  <Text>Année</Text>
                </TouchableOpacity>
              </View>
              <MoodGraf moods={data} />
              {/* <MoodGraftest moods={data} /> */}
            </>
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    marginTop: 35,
    fontSize: 40,
    color: "#696773",
  },
  centre: {
    width: "95%",
    height: "70%",
    gap: 2,
    marginTop: 25,
  },
  options: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 10,
  },
  option: {
    textAlign: "centre",
    marginLeft: 5,
    backgroundColor: "white",
    borderRadius: 8,
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textOption: {
    fontSize: 17,
  },
  display: {
    justifyContent: "center",
    alignItems: "center",
  },
  filtres: {
    borderTopWidth: 1,
    borderTopColor: ` rgba(216, 190, 203,1)`,
    paddingTop: 15,
    marginBottom: 20,
    flexDirection: "row",
    gap: 15,
  },
  filtre: {
    textAlign: "centre",
    marginLeft: 5,
    backgroundColor: "white",
    borderRadius: 8,
    width: 80,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
