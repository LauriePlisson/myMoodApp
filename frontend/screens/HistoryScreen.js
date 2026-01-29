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
import { getMoodsByPeriodAPI } from "../utils/moodAPI";
import { fetchYearMoods } from "../utils/moodByYear";

// Écran d’historique des moods :
// - affichage calendrier ou graphique
// - récupération des moods par période
// - navigation entre mois / année
// - ouverture d’une MoodCard au clic

export default function HistoryScreen() {
  const [displayMood, setDisplayMood] = useState(false);
  const [viewCalendar, setViewCalendar] = useState(true);
  const [viewGraf, setViewGraf] = useState(false);
  // const [viewStats, setViewStat] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [period, setPeriod] = useState("mois");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const user = useSelector((state) => state.user.value);
  const moodsByYear = useSelector((state) => state.moods.moodsByYear);
  const selectedMood = useSelector((state) => state.moods.selectedMood);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const s = styles(colors);

  //ferme moodCard/clear selectedMood quand pas focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        closeMoodCard();
      };
    }, []),
  );

  //fonction openMoodCard
  const openMoodCard = (mood) => {
    dispatch(setSelectedMood(mood));
    setDisplayMood(true);
  };
  //fonction closeMoodCard
  const closeMoodCard = () => {
    setDisplayMood(false);
    dispatch(setSelectedMood(null));
  };

  //fonction fetch moods année
  const loadYear = async (year) => {
    if (moodsByYear[year]) return;

    const data = await fetchYearMoods({
      year,
      token: user.token,
    });

    dispatch(setMoodsByYear({ [year]: data.moods }));
  };

  useEffect(() => {
    //si l'utilisateur se déconnecte: clean les moods
    if (!user.isLoggedIn) {
      dispatch(resetMoods());
      setDisplayMood(false);
      return;
    }
  }, [user]);

  const selectedYear = selectedDate.getFullYear();
  const moodsForSelectedYear = moodsByYear[selectedYear] || [];

  // Filtrage des moods selon la période sélectionnée (mois / année)
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

  //données pour l'affichage du graphique
  let dataForChart = [];

  if (period === "annee") {
    const groupedByMonth = {};
    filtrage.forEach((mood) => {
      const date = new Date(mood.label);
      const month = date.getMonth();
      const year = date.getFullYear(); // récupère l'année
      if (!groupedByMonth[month]) groupedByMonth[month] = { values: [], year };
      groupedByMonth[month].values.push(mood.value);
    });

    dataForChart = Object.entries(groupedByMonth).map(
      ([month, { values, year }]) => {
        const moyenne = Math.round(
          values.reduce((acc, val) => acc + val, 0) / values.length,
        );
        return {
          label: month,
          value: moyenne,
          month: month,
          date: `${parseInt(month) + 1}/${year}`, // mois/année
          note: "",
        };
      },
    );
  } else {
    dataForChart = filtrage.map((m) => ({
      label: new Date(m.label).getDate().toString(),
      value: m.value,
      fullMood: m.fullMood,
    }));
  }

  // Navigation depuis une MoodCard du graphique année (année → mois correspondant)
  const handleVoirMois = () => {
    const year = selectedDate.getFullYear();
    const month = selectedMood.month;
    const newDate = new Date(year, month, 1);
    setPeriod("mois");
    setSelectedDate(newDate);
    closeMoodCard();
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Tes Moods</Text>
      <MoodModal
        setModalVisible={setModalVisible}
        visible={modalVisible}
        date={selectedMood ? selectedMood.dateString : selectedDate}
      />
      <View style={s.centre}>
        <View style={s.options}>
          <TouchableOpacity
            style={[
              s.option,
              viewGraf
                ? { backgroundColor: colors.buttonBackground }
                : { backgroundColor: colors.whiteBlack },
            ]}
            onPress={() => {
              setViewGraf(true);
              // setViewStat(false);
              (setViewCalendar(false), closeMoodCard());
              (setPeriod("mois"), setSelectedDate(new Date()));
            }}
          >
            <Text
              style={[
                s.textOption,
                viewGraf
                  ? { color: colors.whiteBlack, fontWeight: "500" }
                  : { color: colors.textGeneral },
              ]}
            >
              Graphique
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.option,
              viewCalendar
                ? { backgroundColor: colors.buttonBackground }
                : { backgroundColor: colors.whiteBlack },
            ]}
            onPress={() => {
              (setViewGraf(false),
                //  setViewStat(false);
                setViewCalendar(true),
                closeMoodCard());
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
          {/* <TouchableOpacity
            style={[
              s.option,
              viewStats
                ? { backgroundColor: colors.buttonBackground }
                : { backgroundColor: colors.whiteBlack },
            ]}
            onPress={() => {
              setViewGraf(false), setViewStat(true);
              setViewCalendar(false), closeMoodCard();
            }}
          >
            <Text
              style={[
                s.textOption,
                viewStats
                  ? { color: colors.whiteBlack, fontWeight: "500" }
                  : { color: colors.textGeneral },
              ]}
            >
              Statistiques
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={[s.display, viewCalendar ? { marginTop: 10 } : null]}>
          {viewCalendar && (
            <MoodCalendar
              key={moodsByYear.refreshKey || "calendar-default"}
              moods={moodsByYear}
              loadYear={loadYear}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setModalVisible={setModalVisible}
              onMoodPress={openMoodCard}
            />
          )}
          {viewGraf && (
            <>
              <View style={s.filtres}>
                <TouchableOpacity
                  style={[s.filtre]}
                  onPress={() => {
                    (setPeriod("mois"),
                      setSelectedDate(new Date()),
                      closeMoodCard());
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
                    (setPeriod("annee"),
                      setSelectedDate(new Date()),
                      closeMoodCard());
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
                moodsByYear={moodsByYear}
                loadYear={loadYear}
                period={period}
                setPeriod={setPeriod}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onMoodPress={openMoodCard}
                closeMoodCard={closeMoodCard}
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
