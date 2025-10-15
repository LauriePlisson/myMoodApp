import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import MoodCalendar from "../components/MoodCalendar";
import MoodGraf from "../components/MoodGraf";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Dimensions } from "react-native";

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

  const data = [];
  moodsData.forEach((mood) => {
    data.push({ value: mood.moodValue, label: mood.date });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HistoryScreen</Text>
      <View style={styles.centre}>
        <View style={styles.options}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setViewCalendar(true)}
          >
            <Text>Calendrier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setViewCalendar(false)}
          >
            <Text>Graphique</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.display}>
          {viewCalendar ? (
            <MoodCalendar moods={moodsData} onDaySelect={handleDaySelect} />
          ) : (
            <MoodGraf data={data} />
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
    fontSize: 25,
  },
  centre: {
    width: "95%",
    height: "70%",
    gap: 2,
    marginTop: 30,
  },
  options: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  option: {
    textAlign: "centre",
    marginLeft: 5,
    backgroundColor: "white",
    borderRadius: 8,
    width: 90,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  display: {
    // backgroundColor: "#d8becbff",
    // width: "95%",
    // borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
