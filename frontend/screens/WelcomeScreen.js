import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

export default function WelcomeScreen({ navigation }) {
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSummit = async () => {
    if (isLogIn) {
      const dataUser = { email, password };
      const res = await fetch(`${API_URL}/users/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUser),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) setError(data.error);
      if (data.result) {
        console.log("ok");
        // navigation.navigate("TabNavigator");
      }
    }
    if (!isLogIn) {
      const dataUser = { email, password, username };
      const res = await fetch(`${API_URL}/users/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUser),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) setError(data.error);
      if (data.result) {
        console.log("ok");
        // navigation.navigate("TabNavigator");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.cadre, !isLogIn && styles.cadreSignUp]}>
        <Text style={styles.welcome}>Welcome to MyMood</Text>
        <Text>{isLogIn ? "Connexion" : "Création de compte"}</Text>
        <View style={styles.inputs}>
          {!isLogIn && (
            <TextInput
              style={[styles.input]}
              placeholder="username"
              value={username}
              onChangeText={(value) => setUsername(value)}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="email"
            value={email}
            onChangeText={(value) => setEmail(value)}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="pasword"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
          />
        </View>
        <Text style={styles.erreur}>{error}</Text>
        <TouchableOpacity onPress={() => setIsLogIn(!isLogIn)}>
          <Text style={styles.text}>
            {isLogIn
              ? "Pas encore de compte ? Inscris-toi"
              : "Déjà un compte ? Connecte-toi"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bouton, styles.logIn]}
          onPress={() => {
            handleSummit();
          }}
        >
          <Text>{isLogIn ? "Log In" : "Sign Up"}</Text>
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
    backgroundColor: "#fceaf0ff",
    // gap: 15,
  },
  cadre: {
    borderRadius: 20,
    width: "80%",
    height: "45%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#d8becbff",
    paddingTop: 30,
  },
  cadreSignUp: {
    height: "50%",
  },
  welcome: {
    fontSize: 25,
    marginBottom: 10,
  },
  inputs: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    gap: 5,
    marginBottom: 15,
  },
  input: {
    width: "70%",
    height: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ceafbeff",
    backgroundColor: "#fceaf0d8",
    margin: 5,
    borderRadius: 8,
  },
  hiddenInput: {
    opacity: 0,
  },
  erreur: {
    color: "red",
  },
  text: {
    marginBottom: 15,
  },
  bouttons: {
    marginTop: 25,
    flexDirection: "row",
    gap: 15,
  },
  bouton: {
    borderRadius: 8,
    width: 70,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logIn: {
    backgroundColor: "#ceafbeff",
  },
  signUp: {
    backgroundColor: "#fceaf0d8",
  },
});
