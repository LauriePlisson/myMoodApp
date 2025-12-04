import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "../reducers/user";
import { useTheme } from "../context/ThemeContext";

export default function WelcomeScreen({ navigation }) {
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { colors } = useTheme();
  const s = styles(colors);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (user.token) {
      navigation.replace("TabNavigator", { screen: "Home" });
    }
  }, [user]);

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
        navigation.navigate("TabNavigator", { screen: "Home" });
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

      if (data.error) {
        setError(data.error);
      }
      if (data.result) {
        dispatch(
          logIn({ username: data.user.username, token: data.user.token })
        );
        navigation.navigate("TabNavigator", { screen: "home" });
        resetField();
      }
    }
  };

  const resetField = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <SafeAreaView style={[s.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={[s.cadre, !isLogIn && s.cadreSignUp]}>
              <View style={s.titre}>
                <Text style={[s.welcome]}>Welcome to </Text>
                <Text
                  style={[
                    s.welcome,
                    { color: colors.textMyMood, fontWeight: "500" },
                  ]}
                >
                  MyMood
                </Text>
              </View>
              <Text
                style={[
                  {
                    color: colors.textAccent,
                    fontWeight: "600",
                  },
                ]}
              >
                {isLogIn ? "Connexion" : "Création de compte"}
              </Text>
              <View style={s.inputs}>
                {!isLogIn && (
                  <TextInput
                    style={[s.input]}
                    placeholder="username"
                    placeholderTextColor={colors.textGeneral}
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                  />
                )}
                <TextInput
                  style={[s.input]}
                  placeholder="email"
                  placeholderTextColor={colors.textGeneral}
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  keyboardType="email-address"
                />

                <TextInput
                  style={[s.input]}
                  placeholder="password"
                  placeholderTextColor={colors.textGeneral}
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                  secureTextEntry={true}
                />
                <Text style={{ color: colors.textAccent }}>{error}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsLogIn(!isLogIn);
                  resetField();
                }}
              >
                <Text style={{ marginBottom: 15 }}>
                  {isLogIn ? (
                    <>
                      <Text style={[{ fontStyle: "italic" }, s.text]}>
                        Pas encore de compte?{" "}
                      </Text>
                      <Text
                        style={{
                          color: colors.textAccent,
                          textDecorationLine: "underline",
                          textDecorationStyle: "solid",
                          fontWeight: "500",
                        }}
                      >
                        Inscris-toi
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={[s.text, { fontStyle: "italic" }]}>
                        Déjà un compte?{" "}
                      </Text>
                      <Text
                        style={{
                          color: colors.textAccent,
                          fontWeight: "400",
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
                style={s.bouton}
                onPress={() => {
                  handleSummit();
                }}
              >
                <Text style={s.textButton}>
                  {isLogIn ? "Connexion" : "Inscription"}
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
      height: 320,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
    },
    cadreSignUp: {
      height: 370,
    },
    titre: {
      flexDirection: "row",
    },
    welcome: {
      fontSize: 25,
      marginBottom: 10,
      color: colors.textGeneral,
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
      color: colors.textGeneral,
      backgroundColor: colors.inputBackground,
      margin: 5,
      borderRadius: 8,
    },
    text: {
      color: colors.textGeneral,
    },
    bouton: {
      borderRadius: 50,
      width: 105,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.buttonBackground,
    },
    textButton: {
      color: colors.whiteBlack,
      fontSize: 16,
      fontWeight: 400,
    },
  });
