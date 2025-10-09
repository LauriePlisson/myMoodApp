import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>WelcomeScreen</Text>
      <TextInput style={styles.input} placeholder="username" />
      <TextInput style={styles.input} placeholder="pasword" />

      <View style={styles.bouttons}>
        <TouchableOpacity
          style={[styles.bouton, styles.logIn]}
          onPress={() => {
            navigation.navigate("TabNavigator");
          }}
        >
          <Text>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bouton, styles.signUp]}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  input: {
    width: 150,
    height: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ceafbeff",
    backgroundColor: "#f8eef121",
    margin: 5,
    borderRadius: 8,
  },
  bouttons: {
    flexDirection: "row",
    gap: 15,
  },
  bouton: {
    // borderWidth: 1,
    borderRadius: 8,
    width: 70,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logIn: {
    backgroundColor: "#ceafbeff",
  },
  signUp: {
    backgroundColor: "#cfc0c5ff",
  },
});
