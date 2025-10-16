import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
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
      if (data.error) {
        setError(data.error);
      }
      if (data.result) {
        dispatch(
          logIn({ username: data.user.username, token: data.user.token })
        );
        navigation.navigate("TabNavigator");
        resetField();
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
        resetField();
      }
    }
  };

  const resetField = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };
  const toggleSwitch = () => setIsdark((previousState) => !previousState);

  return (
    <SafeAreaView style={[styles.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={[
                styles.cadre,
                !isLogIn && styles.cadreSignUp,
                isDark && { backgroundColor: "#1e1e1e" },
              ]}
            >
              <View style={styles.titre}>
                <Text style={[styles.welcome, isDark && { color: "white" }]}>
                  Welcome to{" "}
                </Text>
                <Text
                  style={[
                    styles.welcome,
                    { color: "#A48A97", fontWeight: "500" /*"#fceaf0e1"*/ },
                  ]}
                >
                  MyMood
                </Text>
              </View>
              <Text
                style={[
                  { color: "#c18d9eff", fontWeight: "600" /*"#fceaf0ff"*/ },
                  isDark && { color: "white" },
                ]}
              >
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
              <TouchableOpacity
                onPress={() => {
                  setIsLogIn(!isLogIn);
                  resetField();
                }}
              >
                <Text style={[styles.text, isDark && { color: "white" }]}>
                  {isLogIn ? (
                    <>
                      <Text style={{ color: "#403e4aff", fontStyle: "italic" }}>
                        Pas encore de compte?{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#c18d9eff",
                          textDecorationLine: "underline",
                          textDecorationStyle: "solid",
                        }}
                      >
                        Inscris-toi
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={{ color: "#403e4aff", fontStyle: "italic" }}>
                        Déjà un compte?{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#c18d9eff",
                          textDecorationLine: "underline",
                          textDecorationStyle: "solid",
                        }}
                      >
                        Connecte-toi
                      </Text>
                    </>
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.bouton,
                  styles.logIn,
                  isDark && styles.boutonDark,
                ]}
                onPress={() => {
                  handleSummit();
                }}
              >
                <Text style={{ color: "#fceaf0ff" }}>
                  {isLogIn ? "Log In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(231, 229, 242, 1)" /*"#fceaf0ff"*/,
  },
  cadre: {
    borderRadius: 20,
    width: 300,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d8becbff",
  },
  cadreSignUp: {
    height: 400,
  },
  titre: {
    flexDirection: "row",
  },
  welcome: {
    fontSize: 25,
    marginBottom: 10,
    color: "#403e4aff",
    fontWeight: "300",
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
    backgroundColor: "#faecf0e9" /* "rgba(226, 223, 240, 1)"*/,
    margin: 5,
    borderRadius: 8,
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
});
