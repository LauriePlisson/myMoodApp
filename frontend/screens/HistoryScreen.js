import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HistoryScreen</Text>
      <View style={styles.centre}>
        <View style={styles.left}>
          <TouchableOpacity style={styles.option}>
            <Text>Calendrier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text>Graphique</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.display}>
          <Text>coucou</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    marginTop: 35,
    fontSize: 25,
  },
  centre: {
    flexDirection: "row",
    width: "95%",
    height: "70%",
    gap: 2,
    marginTop: 30,
  },
  left: {
    // height: "100%",
    // width: "30%",
    backgroundColor: "white",
    borderRadius: 8,
    gap: 15,
    paddingTop: 15,
  },
  option: {
    textAlign: "centre",
    marginLeft: 5,
    backgroundColor: "white",
    borderRadius: 8,
    width: 90,
    height: 35,
    justifyContent: "center",
    alignItems: "center",

    // borderWidth: 2,
  },
  display: {
    backgroundColor: "#d8becbff",
    width: "70%",
    borderRadius: 8,
  },
});
