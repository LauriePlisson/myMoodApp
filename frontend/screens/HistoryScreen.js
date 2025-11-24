import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import MoodCalendar from "../components/MoodCalendar";
import MoodGraf from "../components/MoodGraf";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";

export default function HistoryScreen() {
  const [moodsByYear, setMoodsByYear] = useState({});
  const [displayMood, setDisplayMood] = useState(false);
  const [viewCalendar, setViewCalendar] = useState(true);
  const [period, setPeriod] = useState("mois");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = useSelector((state) => state.user.value);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { colors } = useTheme();
  const s = styles(colors);

  const loadYear = async (year) => {
    if (moodsByYear[year]) return;

    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

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

    setMoodsByYear((prev) => ({
      ...prev,
      [year]: data.moods,
    }));
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    loadYear(currentYear);
  }, [viewCalendar]);

  const selectedYear = selectedDate.getFullYear();
  const moodsForSelectedYear = moodsByYear[selectedYear] || [];

  const filtrage = moodsForSelectedYear
    .filter((mood) => {
      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = selectedDate.getMonth();
      const dayOfWeek = selectedDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(selectedDate);
      monday.setDate(selectedDate.getDate() - diffToMonday);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const moodDate = new Date(mood.date);
      const moodMonth = moodDate.getMonth();
      const moodYear = moodDate.getFullYear();

      if (period === "mois") {
        return moodMonth === selectedMonth && moodYear === selectedYear;
      }
      if (period === "annee") {
        return moodYear === selectedYear;
      }
    })
    .map((mood) => ({
      value: mood.moodValue,
      label: mood.date,
      fullMood: mood,
    }));

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
      fullMood: m.fullMood,
    }));
  }

  const styleMois = {
    color: period === "mois" ? colors.accent : colors.secondary,
  };
  const styleAnnee = {
    color: period === "annee" ? colors.accent : colors.secondary,
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Tes Moods</Text>
      <View style={s.centre}>
        <View style={s.options}>
          <TouchableOpacity
            style={s.option}
            onPress={() => {
              setViewCalendar(true), setDisplayMood(false);
            }}
          >
            <Text
              style={[
                s.textOption,
                viewCalendar
                  ? { color: colors.textOption }
                  : { color: colors.secondary },
              ]}
            >
              Calendrier
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.option}
            onPress={() => {
              setViewCalendar(false),
                setDisplayMood(false),
                setPeriod("mois"),
                setSelectedDate(new Date());
            }}
          >
            <Text
              style={[
                s.textOption,
                !viewCalendar
                  ? { color: colors.textOption }
                  : { color: colors.secondary },
              ]}
            >
              Graphique
            </Text>
          </TouchableOpacity>
        </View>
        <View style={s.display}>
          {viewCalendar ? (
            <MoodCalendar
              moods={moodsByYear}
              loadYear={loadYear}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          ) : (
            <>
              <View style={s.filtres}>
                <TouchableOpacity
                  style={s.filtre}
                  onPress={() => {
                    setPeriod("mois"),
                      setSelectedDate(new Date()),
                      setDisplayMood(false);
                  }}
                >
                  <Text style={styleMois}>Mois</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.filtre}
                  onPress={() => {
                    setPeriod("annee"),
                      setSelectedDate(new Date()),
                      setDisplayMood(false);
                  }}
                >
                  <Text style={styleAnnee}>Année</Text>
                </TouchableOpacity>
              </View>
              <MoodGraf
                moods={dataForChart}
                loadYear={loadYear}
                period={period}
                displayMood={displayMood}
                setDisplayMood={setDisplayMood}
                setPeriod={setPeriod}
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
const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    title: {
      marginTop: 35,
      fontSize: 40,
      color: colors.text,
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
      backgroundColor: colors.optionBouton,
      borderRadius: 8,
      width: 100,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    textOption: {
      fontSize: 17,
      color: colors.textOption,
    },
    display: {
      justifyContent: "flex-start",
      alignItems: "center",
    },
    filtres: {
      borderTopWidth: 1,
      borderTopColor: ` rgba(216, 190, 203,1)`,
      paddingTop: 15,
      flexDirection: "row",
      gap: 15,
    },
    filtre: {
      textAlign: "centre",
      marginLeft: 5,
      backgroundColor: colors.optionBouton,
      borderRadius: 8,
      width: 80,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
    },
  });
