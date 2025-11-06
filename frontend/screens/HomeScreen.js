import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Check, X, Sparkles } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const [editingMood, setEditingMood] = useState(false);
  const [moodValue, setMoodValue] = useState("05");
  const [moodOfTheDay, setMoodOfTheDay] = useState(null);
  const [succesMessage, setSuccesMessage] = useState("");
  const [note, setNote] = useState("");
  const [ajoutCom, setAjoutCom] = useState(false);

  const { colors } = useTheme();
  const s = styles(colors);

  const user = useSelector((state) => state.user.value);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={{ backgroundColor: colors.background }}
    >
      <View style={s.container}>
        <View style={s.containerText}>
          <Text style={s.bienvenue}>Bienvenue {user.username}</Text>

          <Text style={s.text}>​{textHome()}</Text>

          <Text style={{ color: colors.accent }}>{succesMessage}</Text>
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
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.card}
                thumbTintColor={colors.accent}
              />
            </View>
          )}
        </View>
        <View pointerEvents={editingMood ? "auto" : "none"}>
          {!ajoutCom || !editingMood ? (
            <View style={s.sectionCom}>
              <TouchableOpacity
                style={s.boutCom}
                onPress={() => {
                  setAjoutCom(true);
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
                  style={[s.input, { borderBottomWidth: 0.2, width: 250 }]}
                  placeholder="Ajoute un commentaire..."
                  placeholderTextColor={colors.subtext}
                  value={note}
                  onChangeText={(value) => setNote(value)}
                />
                <TouchableOpacity onPress={() => setAjoutCom(false)}>
                  <Check style={{ color: colors.text }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setAjoutCom(false);
                    setNote("");
                  }}
                >
                  <X style={{ color: colors.text }} />
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
              setEditingMood(!editingMood);
              setAjoutCom(false);
            }}
          >
            <Text style={s.modif}>
              {!editingMood ? "Modifier ton Mood?" : "Annuler la modification"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
// }
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
      color: colors.primary,
    },
    text: {
      fontSize: 40,
      marginBottom: 20,
      color: colors.text,
    },
    counterContainer: {
      marginBottom: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    panel: {
      width: 150,
      height: 150,
      backgroundColor: colors.panel,
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
      borderBottomColor: "#696773",
    },
    input: {
      color: colors.text,
      fontSize: 25,
      fontWeight: 100,
    },
    bouton: {
      backgroundColor: colors.bouton,
      width: 120,
      height: 65,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      marginBottom: 15,
      marginTop: 0,
    },
    valider: {
      color: colors.secondary,
      fontSize: 25,
      fontWeight: 100,
    },
    modif: {
      color: colors.accent,
      fontWeight: "400",
    },
  });
