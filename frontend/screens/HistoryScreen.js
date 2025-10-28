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
  const [moodsSelectedYear, setMoodsSelectedYear] = useState([]);
  const [moodsDataFiltered, setMoodsDataFiltered] = useState([]);
  const [viewCalendar, setViewCalendar] = useState(true);
  const [selectedMood, setSelectedMood] = useState({});
  const [period, setPeriod] = useState("mois");
  const [selectedDate, setSelectedDate] = useState(new Date()); // date de référence
  const user = useSelector((state) => state.user.value);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const recupMoodsbyYear = async () => {
      const currentYear = new Date().getFullYear();
      const start = `${currentYear}-01-01`;
      const end = `${currentYear}-12-31`;
      const res = await fetch(
        `${API_URL}/moods/period?start=${start}&end=${end}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      setMoodsSelectedYear(data.moods);
    };
    recupMoodsbyYear();
  }, [viewCalendar]);

  const filtrage = moodsSelectedYear
    .filter((mood) => {
      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = selectedDate.getMonth();
      const dayOfWeek = selectedDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(selectedDate);
      monday.setDate(selectedDate.getDate() - diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const moodDate = new Date(mood.date);
      const moodMonth = moodDate.getMonth();
      const moodYear = moodDate.getFullYear();

      if (period === "mois") {
        return moodMonth === selectedMonth && moodYear === selectedYear;
      }
      if (period === "annee") {
        return moodYear === selectedYear;
      }
      if (period === "semaine") {
        return moodDate >= monday && moodDate <= sunday;
      }
    })
    .map((mood) => ({ value: mood.moodValue, label: mood.date }));

  let dataForChart = [];

  if (period === "annee") {
    const groupedByMonth = {};

    filtrage.forEach((mood) => {
      const date = new Date(mood.label);
      const month = date.getMonth();
      if (!groupedByMonth[month]) groupedByMonth[month] = [];
      groupedByMonth[month].push(mood.value);
    });

    dataForChart = Object.entries(groupedByMonth).map(([month, values]) => {
      const moyenne = Math.round(
        values.reduce((acc, val) => acc + val, 0) / values.length
      );
      return { label: month, value: moyenne };
    });
  } else {
    dataForChart = filtrage.map((m) => ({
      label: new Date(m.label).getDate().toString(),
      value: m.value,
    }));
  }

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
            <MoodCalendar moods={moodsSelectedYear} />
          ) : (
            <>
              <View style={styles.filtres}>
                <TouchableOpacity
                  style={styles.filtre}
                  onPress={() => setPeriod("semaine")}
                >
                  <Text>Semaine</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filtre}
                  onPress={() => setPeriod("mois")}
                >
                  <Text>Mois</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filtre}
                  onPress={() => setPeriod("annee")}
                >
                  <Text>Année</Text>
                </TouchableOpacity>
              </View>
              {/* <MoodGraf moods={data} /> */}
              <MoodGraftest
                moods={dataForChart}
                period={period}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
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
