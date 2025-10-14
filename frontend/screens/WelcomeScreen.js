import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "../reducers/user";

export default function WelcomeScreen({ navigation }) {
  const [isDark, setIsdark] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

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
      // console.log(data);
      if (data.error) {
        setError(data.error);
      }
      if (data.result) {
        dispatch(
          logIn({ username: data.user.username, token: data.user.token })
        );
        navigation.navigate("TabNavigator");
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
      // console.log(data);
      if (data.error) {
        setError(data.error);
      }
      if (data.result) {
        dispatch(
          logIn({ username: data.user.username, token: data.user.token })
        );
        navigation.navigate("TabNavigator");
      }
    }
  };

  const toggleSwitch = () => setIsdark((previousState) => !previousState);

  return (
    <SafeAreaView
      style={[styles.container, isDark && { backgroundColor: "#121212" }]}
    >
      <View style={styles.dark}>
        <Text style={isDark && { color: "white" }}>DarkMode</Text>
        <Switch
          trackColor={{ false: "#d8becbff", true: "#767577" }}
          thumbColor={!isDark ? "#fceaf0ff" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isDark}
        />
      </View>
      <View
        style={[
          styles.cadre,
          !isLogIn && styles.cadreSignUp,
          isDark && { backgroundColor: "#1e1e1e" },
        ]}
      >
        <Text style={[styles.welcome, isDark && { color: "white" }]}>
          Welcome to MyMood
        </Text>
        <Text style={isDark && { color: "white" }}>
          {isLogIn ? "Connexion" : "Création de compte"}
        </Text>
        <View style={styles.inputs}>
          {!isLogIn && (
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="username"
              value={username}
              onChangeText={(value) => setUsername(value)}
            />
          )}
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="email"
            value={email}
            onChangeText={(value) => setEmail(value)}
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="pasword"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
          />
        </View>
        <Text style={styles.erreur}>{error}</Text>
        <TouchableOpacity onPress={() => setIsLogIn(!isLogIn)}>
          <Text style={[styles.text, isDark && { color: "white" }]}>
            {isLogIn
              ? "Pas encore de compte ? Inscris-toi"
              : "Déjà un compte ? Connecte-toi"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bouton, styles.logIn, isDark && styles.boutonDark]}
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
  inputDark: {
    backgroundColor: "#d3ceced8",
    borderColor: "#b8b8b8d8",
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
  boutonDark: {
    backgroundColor: "#d3ceced8",
  },
  logIn: {
    backgroundColor: "#ceafbeff",
  },
  signUp: {
    backgroundColor: "#fceaf0d8",
  },
  dark: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 60,
    left: 250,
  },
});
