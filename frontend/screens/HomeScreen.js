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
import { useSelector } from "react-redux";
import { Check, X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const [editingMood, setEditingMood] = useState(false);
  const [moodValue, setMoodValue] = useState("05");
  const [moodOfTheDay, setMoodOfTheDay] = useState(null);
  const [backupMoodValue, setBackupMoodValue] = useState(null);
  const [backupNote, setBackupNote] = useState(null);
  const [succesMessage, setSuccesMessage] = useState("");
  const [note, setNote] = useState("");
  const [ajoutCom, setAjoutCom] = useState(false);

  const { colors } = useTheme();
  const s = styles(colors);

  const user = useSelector((state) => state.user.value);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const commentInputRef = useRef(null);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await fetch(`${API_URL}/moods/today`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();

        if (data.result && data.mood) {
          setMoodOfTheDay(data.mood);
          setMoodValue(data.mood.moodValue.toString());
          setNote(data.mood.note || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchToday();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (moodOfTheDay) {
        updateMoodStates(moodOfTheDay);
        setEditingMood(false);
      } else {
        setMoodOfTheDay(null);
        setEditingMood(true);
        setMoodValue("05");
        setNote("");
      }
      setAjoutCom(false);
    }, [moodOfTheDay])
  );

  const handleValider = () => {
    saveMood();
    setEditingMood(false);
  };

  const saveMood = async () => {
    const body = { moodValue, note };
    const url = moodOfTheDay
      ? `${API_URL}/moods/${moodOfTheDay._id}`
      : `${API_URL}/moods/`;
    const method = moodOfTheDay ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.result) {
      moodOfTheDay
        ? setSuccesMessage("Mood modifié avec succès")
        : setSuccesMessage("Mood du jour enregistré");
      setTimeout(() => setSuccesMessage(""), 4000);
      updateMoodStates(data.mood);
    }
  };

  const updateMoodStates = (mood) => {
    setMoodOfTheDay(mood);
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

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={{ backgroundColor: colors.background }}
    >
      <View style={s.container}>
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
                  width: "100%",
                  gap: 15,
                }}
              >
                <TextInput
                  style={[
                    s.input,
                    {
                      borderBottomWidth: 0.2,
                      width: 250,
                      borderColor: colors.textGeneral,
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
                />
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
