import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import MoodCalendar from "../components/MoodCalendar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function HistoryScreen() {
  const [moodsData, setMoodsData] = useState([]);
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
      // console.log(data);
      setMoodsData(data.moods);
    };
    recupMoods();
  }, []);

  const handleDaySelect = (dateString) => {
    const mood = dataMoods.find(
      (m) => new Date(m.date).toISOString().split("T")[0] === dateString
    );
    setSelectedMood(mood || null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HistoryScreen</Text>
      <View style={styles.centre}>
        <View style={styles.left}>
          <TouchableOpacity style={styles.option}>
            <Text>Calendrier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text>Graphique</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.display}>
          <MoodCalendar moods={moodsData} onDaySelect={handleDaySelect} />
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
    flexDirection: "row",
    width: "95%",
    height: "70%",
    gap: 2,
    marginTop: 30,
  },
  left: {
    // height: "100%",
    // width: "30%",
    backgroundColor: "white",
    borderRadius: 8,
    gap: 15,
    paddingTop: 15,
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

    // borderWidth: 2,
  },
  display: {
    backgroundColor: "#d8becbff",
    width: "70%",
    borderRadius: 8,
  },
});
