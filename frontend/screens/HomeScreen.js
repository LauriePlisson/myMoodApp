import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setMoodOfTheDay,
  updateMoodInYear,
  setSelectedMood,
} from "../reducers/moods";
import {
  saveMoodAPI,
  getMoodTodayAPI,
  getMoodsByPeriodAPI,
} from "../utils/moodAPI";
import { Check, X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { logOut } from "../reducers/user";
import MoodModal from "../components/MoodModal";

export default function HomeScreen({ navigation }) {
  const [editingMood, setEditingMood] = useState(false);
  const [moodValue, setMoodValue] = useState("05");
  const [backupMoodValue, setBackupMoodValue] = useState(null);
  const [backupNote, setBackupNote] = useState(null);
  const [succesMessage, setSuccesMessage] = useState("");
  const [note, setNote] = useState("");
  const [ajoutCom, setAjoutCom] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [yesterdayMood, setYesterdayMood] = useState(false);

  const { colors } = useTheme();
  const s = styles(colors);

  const moodOfTheDay = useSelector((state) => state.moods.moodOfTheDay);
  const selectedMood = useSelector((state) => state.moods.selectedMood);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const commentInputRef = useRef(null);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const yesterdayStr = formatDate(yesterday);

  useEffect(() => {
    //si token expiré retourn a welcome
    if (!user.isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
      return;
    }

    //cherche si mood enregistré pour aujourd'hui
    const fetchToday = async () => {
      try {
        const data = await getMoodTodayAPI(user.token, () =>
          dispatch(logOut()),
        );
        if (!data) return;
        if (data.result && data.mood) {
          dispatch(setMoodOfTheDay(data.mood));
          setMoodValue(data.mood.moodValue.toString());
          setNote(data.mood.note || "");
        }
      } catch (err) {
        // console.error(err);
      }
    };

    //Mood Saved pour hier?
    const fetchyesterday = async () => {
      try {
        const start = new Date(yesterday);
        start.setHours(0, 0, 0, 0);

        const end = new Date(yesterday);
        end.setHours(23, 59, 59, 999);

        const data = await getMoodsByPeriodAPI({
          userToken: user.token,
          start: start.toISOString(),
          end: end.toISOString(),
        });

        setYesterdayMood(data?.count > 0);
      } catch (err) {
        // console.log(err);
      }
    };

    fetchToday();
    fetchyesterday();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (moodOfTheDay) {
        updateMoodStates(moodOfTheDay);
      } else {
        setEditingMood(true);
        setMoodValue("05");
        setNote("");
      }
      setAjoutCom(false);
    }, [moodOfTheDay]),
  );

  const handleValider = () => {
    saveMood();
    setEditingMood(false);
  };

  const saveMood = async () => {
    const { mood, success, message } = await saveMoodAPI({
      userToken: user.token,
      existingMood: moodOfTheDay,
      moodValue,
      note,
    });

    if (success) {
      moodOfTheDay
        ? setSuccesMessage(message)
        : setSuccesMessage("Mood du jour enregistré");
      setTimeout(() => setSuccesMessage(""), 4000);
      updateMoodStates(mood);
    }
  };

  const updateMoodStates = (mood) => {
    dispatch(setMoodOfTheDay(mood));
    dispatch(updateMoodInYear({ mood })); // mise à jour globale de l'année
    setMoodValue(mood.moodValue.toString());
    setNote(mood.note || "");
    setEditingMood(false);
  };

  const textHome = () => {
    if (editingMood && moodOfTheDay) return "Modifie ton Mood";
    if (moodOfTheDay && !editingMood) return "Ton Mood du jour";
    if (!moodOfTheDay) return "Ajoute ton Mood";
  };

  const handleModif = () => {
    if (!editingMood) {
      setBackupMoodValue(moodValue);
      setBackupNote(note);
    } else {
      setMoodValue(backupMoodValue);
      setNote(backupNote);
      setSuccesMessage("Modification Annulée");
      setTimeout(() => setSuccesMessage(""), 4000);
    }
    setEditingMood(!editingMood);
    setAjoutCom(false);
  };

  const handleCommentCheck = () => {
    setAjoutCom(false);
  };

  const handleHier = () => {
    dispatch(
      setSelectedMood({
        dateString: yesterdayStr,
        value: null,
        note: "",
        fullMood: null,
      }),
    );
    setOpenModal(true);
  };

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={{ backgroundColor: colors.background }}
    >
      <View style={s.container}>
        <MoodModal
          setModalVisible={setOpenModal}
          visible={openModal}
          date={selectedMood?.dateString}
          onMoodSaved={(mood) => {
            // console.log("Mood hier sauvegardé:", mood);
            setYesterdayMood(true);
          }}
        />
        <View style={s.containerText}>
          <Text style={s.bienvenue}>Bienvenue {user.username}</Text>

          <Text style={s.text}>​{textHome()}</Text>

          <Text style={s.message}>{succesMessage}</Text>
        </View>
        <View style={s.counterContainer}>
          <View style={s.panel}>
            <Text style={s.digit}>
              {Number(moodValue).toString().padStart(2, "0")}
            </Text>
          </View>
          {editingMood && (
            <View>
              <Slider
                style={[s.slider]}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={Number(moodValue)}
                onValueChange={(value) => setMoodValue(value.toString())}
                minimumTrackTintColor={colors.buttonBackground}
                maximumTrackTintColor={colors.cardBackground}
                thumbTintColor={colors.buttonBackground}
              />
            </View>
          )}
        </View>
        <View pointerEvents={editingMood ? "auto" : "none"}>
          {!ajoutCom || !editingMood ? (
            <View style={s.sectionCom}>
              <TouchableOpacity
                style={editingMood ? s.boutCom : null}
                onPress={() => {
                  setAjoutCom(true);
                  if (!backupNote) {
                    setBackupNote(note); // on ne sauvegarde que si on n’a pas déjà de backup
                  }
                  setTimeout(() => {
                    commentInputRef.current?.focus();
                  }, 100);
                }}
              >
                <Text style={s.input}>
                  {!note ? "Ajoute un commentaire" : `Commentaire : ${note}`}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.sectionCom}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: 15,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={[
                      s.input,
                      {
                        borderBottomWidth: 0.2,
                        width: 200,
                        borderColor: colors.textGeneral,
                        fontSize: 20,
                      },
                    ]}
                    placeholder="Ajoute un commentaire..."
                    placeholderTextColor={colors.textPlaceHolder}
                    value={note}
                    selectionColor={colors.textAccent}
                    onChangeText={(value) => setNote(value)}
                    ref={commentInputRef}
                    returnKeyType="done"
                    onSubmitEditing={handleCommentCheck}
                    maxLength={25}
                  />
                  {note.length > 0 && (
                    <Text style={[s.input, { fontSize: 15 }]}>
                      {note.length}/25
                    </Text>
                  )}
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <TouchableOpacity onPress={() => handleCommentCheck()}>
                    <Check style={{ color: colors.textAccent }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setAjoutCom(false);
                      setNote(backupNote);
                    }}
                  >
                    <X style={{ color: colors.textGeneral }} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {editingMood && (
          <TouchableOpacity
            style={s.bouton}
            onPress={() => {
              handleValider();
            }}
          >
            <Text style={s.valider}>
              {!moodOfTheDay ? "Valider" : "Modifier"}
            </Text>
          </TouchableOpacity>
        )}
        {moodOfTheDay && (
          <TouchableOpacity
            onPress={() => {
              handleModif();
            }}
          >
            <Text style={s.message}>
              {!editingMood ? "Modifier ton Mood?" : "Annuler la modification"}
            </Text>
          </TouchableOpacity>
        )}

        {!yesterdayMood && (
          <>
            <Text style={{ color: colors.textGeneral }}>
              Tu n'as pas enregistré ton Mood pour hier
            </Text>
            <TouchableOpacity onPress={() => handleHier()}>
              <Text style={{ color: colors.textAccent }}>Note ta journée</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    containerText: {
      marginTop: 30,
      alignItems: "center",
      marginBottom: 20,
    },
    bienvenue: {
      fontSize: 30,
      fontWeight: 100,
      color: colors.textGeneral,
    },
    text: {
      fontSize: 40,
      marginBottom: 20,
      color: colors.textMyMood,
    },
    counterContainer: {
      marginBottom: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    panel: {
      width: 150,
      height: 150,
      backgroundColor: colors.whiteBlack,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    digit: {
      fontSize: 50,
      color: colors.number,
    },
    slider: {
      width: 200,
      height: 40,
    },
    sectionCom: {
      height: 60,
    },
    boutCom: {
      borderBottomWidth: 0.5,
      borderBottomColor: colors.textGeneral,
    },
    input: {
      color: colors.textGeneral,
      fontSize: 25,
      fontWeight: 100,
    },
    bouton: {
      backgroundColor: colors.buttonBackground,
      borderRadius: 50,
      width: 105,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
      marginTop: 0,
    },
    valider: {
      color: colors.whiteBlack,
      fontSize: 16,
      fontWeight: 400,
    },
    message: {
      color: colors.textAccent,
      fontSize: 16,
      fontWeight: 400,
    },
  });
