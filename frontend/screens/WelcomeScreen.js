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
import { useTheme } from "../context/ThemeContext";

export default function WelcomeScreen({ navigation }) {
  const [isDark, setIsdark] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { colors } = useTheme();
  const s = styles(colors);
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
    <SafeAreaView style={[s.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={[
                s.cadre,
                !isLogIn && s.cadreSignUp,
                isDark && { backgroundColor: "#1e1e1e" },
              ]}
            >
              <View style={s.titre}>
                <Text style={[s.welcome]}>Welcome to </Text>
                <Text
                  style={[s.welcome, { color: "#A48A97", fontWeight: "500" }]}
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
              <View style={s.inputs}>
                {!isLogIn && (
                  <TextInput
                    style={[s.input]}
                    placeholder="username"
                    placeholderTextColor={colors.subtext}
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                  />
                )}
                <TextInput
                  style={[s.input]}
                  placeholder="email"
                  placeholderTextColor={colors.subtext}
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  keyboardType="email-address"
                />

                <TextInput
                  style={[s.input]}
                  placeholder="pasword"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                  secureTextEntry={true}
                />
              </View>
              <Text style={s.erreur}>{error}</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsLogIn(!isLogIn);
                  resetField();
                }}
              >
                <Text style={[s.text]}>
                  {isLogIn ? (
                    <>
                      <Text
                        style={{ color: colors.secondary, fontStyle: "italic" }}
                      >
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
                      <Text
                        style={{ color: colors.secondary, fontStyle: "italic" }}
                      >
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
                style={[s.bouton, s.logIn]}
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

const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    cadre: {
      borderRadius: 20,
      width: 300,
      height: 350,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
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
      color: colors.secondary,
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
      color: colors.subtext,
      borderWidth: 1,
      borderColor: colors.borderInputColor,
      backgroundColor: colors.input,
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
      backgroundColor: colors.bouton,
    },
  });
