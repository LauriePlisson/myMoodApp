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
  const [note, setNote] = useState("");
  const formattedNote = note.padStart(2, "0");
  const user = useSelector((state) => state.user.value);

  const handleValider = () => {
    setNote(formattedNote);
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
