import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
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

export default function HomeScreen({ navigation }) {
  const [moodValue, setMoodValue] = useState("05");
  const [moodOfTheDay, setMoodOfTheDay] = useState(null);
  const [succesMessage, setSuccesMessage] = useState("");
  const [note, setNote] = useState("");
  const [ajoutCom, setAjoutCom] = useState(false);

  const user = useSelector((state) => state.user.value);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchToday = async () => {
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
    };
    fetchToday();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (moodOfTheDay) {
        setMoodValue(moodOfTheDay.moodValue.toString());
        setNote(moodOfTheDay.note || "");
      } else {
        setMoodValue("05");
        setNote("");
      }
      setAjoutCom(false);
    }, [moodOfTheDay])
  );

  const handleValider = () => {
    saveMood();
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
      setMoodOfTheDay(data.mood);
      setMoodValue(data.mood.moodValue.toString());
      setNote(data.mood.note || "");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.containerText}>
          <Text style={styles.bienvenue}>Bienvenue {user.username}</Text>
          <View style={{ flexDirection: "row" }}>
            <Sparkles color={"#d8becbff"} />
            <Text style={styles.text}>
              ​{!moodOfTheDay ? "​Note ta journée​" : "Modifie ta note"}​​
            </Text>
            <Sparkles color={"#d8becbff"} />
          </View>
          <Text>{succesMessage}</Text>
        </View>
        <View style={styles.counterContainer}>
          <View style={styles.panel}>
            <Text style={styles.digit}>
              {Number(moodValue).toString().padStart(2, "0")}
            </Text>
          </View>
          <Slider
            style={[styles.slider]}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={Number(moodValue)}
            onValueChange={(value) => setMoodValue(value.toString())}
            minimumTrackTintColor="#d8becbff"
            maximumTrackTintColor="#f7e4eeff"
            thumbTintColor="#d8becbff"
          />
        </View>
        {!ajoutCom ? (
          <View style={styles.sectionCom}>
            <TouchableOpacity
              style={styles.boutCom}
              onPress={() => {
                setAjoutCom(true);
              }}
            >
              <Text style={styles.valider}>
                {!note ? "Ajoute un commentaire" : `${note}`}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sectionCom}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                gap: 15,
              }}
            >
              <TextInput
                style={[styles.valider, { borderBottomWidth: 0.2, width: 250 }]}
                placeholder="Ajoute un commentaire..."
                value={note}
                onChangeText={(value) => setNote(value)}
              />
              <TouchableOpacity onPress={() => setAjoutCom(false)}>
                <Check />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAjoutCom(false);
                  setNote("");
                }}
              >
                <X />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.bouton}
          onPress={() => {
            handleValider();
          }}
        >
          <Text style={styles.valider}>
            {!moodOfTheDay ? "Valider" : "Modifier"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: "#CDD5D1",
  },
  containerText: {
    alignItems: "center",
    marginBottom: 30,
  },
  bienvenue: {
    color: "#A48A97",
  },
  text: {
    fontSize: 40,
    marginBottom: 20,
    color: "#696773",
  },
  counterContainer: {
    marginBottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  panel: {
    width: 150,
    height: 150,
    marginHorizontal: 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    fontSize: 50,
  },
  slider: {
    width: 200,
    height: 40,
  },
  exit: {
    marginLeft: 300,
    paddingBottom: 10,
    width: 50,
    height: 30,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputCom: {
    height: 50,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 10,
  },
  boutCom: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#696773",
    marginBottom: 10,
  },
  bouton: {
    backgroundColor: "#d8becbff",
    width: 120,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  valider: {
    color: "rgba(44, 43, 49, 1)",
    fontSize: 25,
    fontWeight: 100,
  },
  sectionCom: {
    height: 75,
  },
});
