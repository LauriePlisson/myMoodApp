import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MoodModal from "../components/MoodModal";
import MoodCalendar from "../components/MoodCalendar";
import MoodGraf from "../components/MoodGraf";
import MoodCard from "../components/MoodCard";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { setMoodsByYear, resetMoods, setSelectedMood } from "../reducers/moods";

export default function HistoryScreen() {
  const [displayMood, setDisplayMood] = useState(false);
  const [viewCalendar, setViewCalendar] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [period, setPeriod] = useState("mois");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const user = useSelector((state) => state.user.value);
  const moodsByYear = useSelector((state) => state.moods.moodsByYear);
  const selectedMood = useSelector((state) => state.moods.selectedMood);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const s = styles(colors);

  useFocusEffect(
    useCallback(() => {
      //recharge l'année en cours au focus
      const year = selectedDate.getFullYear();
      loadYear(year);
    }, [])
  );

  //fonction openMoodCard
  const openMoodCard = (mood) => {
    dispatch(setSelectedMood(mood)); // mood global
    setDisplayMood(true); // afficher la card
  };
  //fonction closeMoodCard
  const closeMoodCard = () => {
    setDisplayMood(false);
    dispatch(setSelectedMood(null));
  };
  //fonction fetch moods année
  const loadYear = async (year) => {
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

    dispatch(setMoodsByYear({ [year]: data.moods }));
  };

  useEffect(() => {
    //si l'utilisateur se déconnecte: clean les moods
    if (!user.isLoggedIn) {
      dispatch(resetMoods());
      setDisplayMood(false);
      return;
    }
    //fetch l'année en cours
    const currentYear = new Date().getFullYear();
    loadYear(currentYear);
  }, [viewCalendar, user]);

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

  const handleVoirMois = () => {
    const year = selectedDate.getFullYear();
    const month = selectedMood.month;
    const newDate = new Date(year, month, 1);
    setPeriod("mois");
    setSelectedDate(newDate);
    setDisplayMood(false);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Tes Moods</Text>
      <MoodModal
        setModalVisible={setModalVisible}
        visible={modalVisible}
        date={selectedMood ? selectedMood.dateString : selectedDate}
        setMoodsByYear={setMoodsByYear}
      />
      <View style={s.centre}>
        <View style={s.options}>
          <TouchableOpacity
            style={[
              s.option,
              viewCalendar
                ? { backgroundColor: colors.buttonBackground }
                : { backgroundColor: colors.whiteBlack },
            ]}
            onPress={() => {
              setViewCalendar(true), setDisplayMood(false);
            }}
          >
            <Text
              style={[
                s.textOption,
                viewCalendar
                  ? { color: colors.whiteBlack, fontWeight: "500" }
                  : { color: colors.textGeneral },
              ]}
            >
              Calendrier
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.option,
              !viewCalendar
                ? { backgroundColor: colors.buttonBackground }
                : { backgroundColor: colors.whiteBlack },
            ]}
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
                  ? { color: colors.whiteBlack, fontWeight: "500" }
                  : { color: colors.textGeneral },
              ]}
            >
              Graphique
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[s.display, viewCalendar ? { marginTop: 10 } : null]}>
          {viewCalendar ? (
            <MoodCalendar
              key={moodsByYear.refreshKey || "calendar-default"}
              moods={moodsByYear}
              loadYear={loadYear}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setModalVisible={setModalVisible}
              onMoodPress={openMoodCard}
            />
          ) : (
            <>
              <View style={s.filtres}>
                <TouchableOpacity
                  style={[s.filtre]}
                  onPress={() => {
                    setPeriod("mois"),
                      setSelectedDate(new Date()),
                      setDisplayMood(false);
                  }}
                >
                  <Text
                    style={
                      period === "mois"
                        ? {
                            color: colors.buttonBackground,
                            fontWeight: "bold",
                            letterSpacing: 0.2,
                          }
                        : { color: colors.textGeneral }
                    }
                  >
                    Mois
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.filtre]}
                  onPress={() => {
                    setPeriod("annee"),
                      setSelectedDate(new Date()),
                      setDisplayMood(false);
                  }}
                >
                  <Text
                    style={
                      period === "annee"
                        ? {
                            color: colors.buttonBackground,
                            fontWeight: "bold",
                          }
                        : { color: colors.textGeneral }
                    }
                  >
                    Année
                  </Text>
                </TouchableOpacity>
              </View>
              <MoodGraf
                moods={dataForChart}
                loadYear={loadYear}
                period={period}
                setPeriod={setPeriod}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onMoodPress={openMoodCard}
              />
            </>
          )}
        </View>
      </View>
      {displayMood && (
        <MoodCard
          setModalVisible={setModalVisible}
          isCalendar={viewCalendar}
          period={period}
          // setSelectedDateString={setSelectedDateString}
          handleVoirMois={handleVoirMois}
          onCloseMood={closeMoodCard}
        />
      )}
    </View>
  );
}
const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.background,
    },
    title: {
      marginTop: 35,
      fontSize: 40,
      color: colors.textMyMood,
    },
    centre: {
      width: "95%",
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
      borderRadius: 12,
      width: 105,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    textOption: {
      fontSize: 17,
    },
    filtres: {
      borderTopWidth: 1,
      borderTopColor: colors.buttonBackground,
      flexDirection: "row",
      gap: 15,
    },
    filtre: {
      textAlign: "centre",
      marginTop: 15,
      width: 80,
      justifyContent: "center",
      alignItems: "center",
    },
    display: {
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });
