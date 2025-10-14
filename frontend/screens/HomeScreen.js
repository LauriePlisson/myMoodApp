import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Check, X, Sparkles } from "lucide-react-native";

export default function HomeScreen({ navigation }) {
  const [note, setNote] = useState("05");
  const [ajoutCom, setAjoutCom] = useState(false);
  const formattedNote = note.padStart(2, "0");
  const user = useSelector((state) => state.user.value);

  const handleValider = () => {
    setNote(formattedNote);
  };

  const handleAjouter = () => {
    console.log("ajouter un commentaire");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.bienvenue}>Bienvenue {user.username}</Text>
      <View style={{ flexDirection: "row" }}>
        <Sparkles color={"#d8becbff"} />
        <Text style={styles.text}>​​Note ta journée​​​</Text>
        <Sparkles color={"#d8becbff"} />
      </View>
      <View style={styles.counterContainer}>
        <View style={styles.panel}>
          <TextInput
            style={styles.digit}
            keyboardType="numeric"
            maxLength={2}
            value={note}
            onChangeText={(e) => {
              setNote(e);
            }}
          />
        </View>
      </View>
      {!ajoutCom ? (
        <View style={styles.sectionCom}>
          <TouchableOpacity
            style={styles.boutCom}
            onPress={() => {
              if (!ajoutCom) {
                setAjoutCom(true);
              } else {
                handleAjouter();
              }
            }}
          >
            <Text style={styles.valider}>
              {!ajoutCom ? "Ajoute un commentaire" : "Ajouter"}
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
              style={[styles.valider, { borderBottomWidth: 0.2 }]}
              placeholder="Ajoute un commentaire..."
            />
            <Check />
            <X onPress={() => setAjoutCom(false)} />
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.bouton}
        onPress={() => {
          handleValider();
        }}
      >
        <Text style={styles.valider}>Valider</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  bienvenue: {
    color: "#A48A97",
  },
  text: {
    fontSize: 40,
    marginBottom: 50,
    color: "#696773",
  },
  counterContainer: {
    flexDirection: "row",
    marginBottom: 50,
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
