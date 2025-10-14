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
      <Text style={styles.text}>​✨​Note ta journée​✨​​</Text>
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
      {ajoutCom && (
        <>
          <TouchableOpacity
            style={styles.exit}
            onPress={() => setAjoutCom(false)}
          >
            <Text style={{ fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputCom}
            placeholder="Ajoute un commentaire..."
          ></TextInput>
        </>
      )}
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
    marginBottom: 15,
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
});
