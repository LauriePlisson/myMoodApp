import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, changeUsername } from "../reducers/user";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { Check, X } from "lucide-react-native";
import * as Notifications from "expo-notifications";

export default function SettingsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [openFrom, setOpenFrom] = useState("");
  const [succesMessage, setSuccesMessage] = useState("");
  const [error, setError] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorEdit, setErrorEdit] = useState("");

  const { notificationsEnabled, toggleNotifications } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const user = useSelector((state) => state.user.value);

  const { colors } = useTheme();
  const s = styles(colors);

  const handleEdit = async () => {
    const body = {
      username: newUsername,
      password: oldPassword,
      newPassword: newPassword,
    };
    const res = await fetch(`${API_URL}/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (data.error) {
      setErrorEdit(data.error);
      setTimeout(() => setErrorEdit(""), 5000);
    }
    if (data.result) {
      if (newUsername !== "") {
        dispatch(changeUsername(newUsername));
      }
      setSuccesMessage("Changement enregistré");
      setTimeout(() => setSuccesMessage(""), 3000);
      setEditPassword(false);
      setEditUsername(false);
      setNewUsername("");
      setNewPassword("");
      setOldPassword("");
    }
  };

  const handleLogOut = () => {
    dispatch(logOut());
    navigation.navigate("Welcome");
  };

  const handleDelete = async () => {
    const res = await fetch(`${API_URL}/users/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    }
    if (data.result) {
      dispatch(logOut());
      navigation.navigate("Welcome");
    }
  };

  const handlePressOui = () => {
    setModalVisible(false);
    if (openFrom === "LogOut") {
      handleLogOut();
    }
    if (openFrom === "Delete") {
      handleDelete();
    }
    if (openFrom === "Edit") {
      handleEdit();
    }
  };

  const handlePressNon = () => {
    setModalVisible(false);
    if (openFrom === "Edit")
      setSuccesMessage("Modification annulée"),
        setTimeout(() => setSuccesMessage(""), 3000);
    if (openFrom === "LogOut" || openFrom === "Delete")
      setSuccesMessage("Annulé"), setTimeout(() => setSuccesMessage(""), 3000);
  };

  return (
    <SafeAreaView style={s.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text
              style={{
                color: colors.textMyMood,
                fontWeight: "500",
                letterSpacing: 0.2,
              }}
            >
              Es tu sure?
            </Text>
            <View style={s.boutonsModale}>
              <TouchableOpacity
                style={[s.boutonModale, { backgroundColor: "#e9d5e3ff" }]} //"#fceaf0ff"
                onPress={() => handlePressOui()}
              >
                <Text style={s.textStyle}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.boutonModale, { backgroundColor: "#c890b5ff" }]} //"#d8becbff"
                onPress={() => {
                  handlePressNon();
                }}
              >
                <Text style={s.textStyle}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={s.topPage}>
        <Text style={s.settings}>Réglages</Text>
        <Text style={s.message}>{succesMessage}</Text>
      </View>
      <View style={s.reglages}>
        <View style={s.infoUser}>
          {editUsername ? (
            <View style={s.editUsernameSection}>
              <Text style={s.textEdit}>Nom d'utilisateur</Text>
              <View style={s.editUsername}>
                <TextInput
                  style={s.input}
                  placeholderTextColor={colors.textGeneral}
                  placeholder={user.username}
                  value={newUsername}
                  onChangeText={(value) => setNewUsername(value)}
                />
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    setOpenFrom("Edit");
                  }}
                >
                  <Check size={20} color={colors.textAccent} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditUsername(false);
                    setNewUsername("");
                  }}
                >
                  <X size={20} color={colors.textGeneral} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                s.bouton,
                {
                  borderBottomColor: colors.textMyMood,
                  borderBottomWidth: 0.5,
                },
              ]}
              onPress={() => {
                setEditUsername(true);
              }}
            >
              <Text style={s.subtext}>Changer de nom d'utilisateur</Text>
            </TouchableOpacity>
          )}

          {editPassword ? (
            <View style={s.editPassSection}>
              <Text style={s.textEdit}>Mot de Passe</Text>
              <View style={s.editPass}>
                <View style={{ margin: 0 }}>
                  <TextInput
                    style={s.input}
                    placeholder="Password"
                    value={oldPassword}
                    placeholderTextColor={colors.textGeneral}
                    onChangeText={(value) => setOldPassword(value)}
                    secureTextEntry={true}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="New Password"
                    placeholderTextColor={colors.textGeneral}
                    value={newPassword}
                    onChangeText={(value) => setNewPassword(value)}
                    secureTextEntry={true}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    setOpenFrom("Edit");
                  }}
                >
                  <Check size={20} color={colors.textAccent} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditPassword(false);
                    setNewPassword("");
                    setOldPassword("");
                  }}
                >
                  <X size={20} color={colors.textGeneral} />
                </TouchableOpacity>
              </View>
              {errorEdit && <Text style={[s.textEdit]}>{errorEdit}</Text>}
            </View>
          ) : (
            <TouchableOpacity
              style={s.bouton}
              onPress={() => {
                setEditPassword(true);
              }}
            >
              <Text style={s.subtext}>Changer de mot de passe</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={s.mode}>
          <View
            style={[
              s.bouton,
              {
                borderBottomColor: colors.textMyMood,
                borderBottomWidth: 0.5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 15,
              },
            ]}
          >
            <Text style={s.subtext}>Notifications</Text>
            <Switch
              style={{ marginTop: 10 }}
              value={notificationsEnabled}
              trackColor={
                theme === "dark"
                  ? { false: "#767577", true: "#2e3034ff" }
                  : { false: "#767577", true: "#A48A97" }
              }
              thumbColor={theme === "dark" ? "#A48A97" : "#f4f3f4"}
              onValueChange={toggleNotifications}
            ></Switch>
          </View>
          <View
            style={[
              s.bouton,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 15,
              },
            ]}
          >
            <Text style={s.subtext}>Mode sombre</Text>
            <Switch
              onValueChange={toggleTheme}
              value={theme === "dark"}
              style={{ marginTop: 10 }}
              trackColor={{ false: "#767577", true: "#2e3034ff" }}
              thumbColor={theme === "dark" ? "#A48A97" : "#f4f3f4"}
            ></Switch>
          </View>
        </View>
        <View style={s.quitte}>
          <TouchableOpacity
            style={[
              s.bouton,
              { borderBottomColor: colors.textMyMood, borderBottomWidth: 0.5 },
            ]}
            onPress={() => {
              setModalVisible(true);
              setOpenFrom("LogOut");
            }}
          >
            <Text style={s.subtext}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.bouton]}
            onPress={() => {
              setModalVisible(true);
              setOpenFrom("Delete");
            }}
          >
            <Text style={[s.subtext, { color: colors.textAccent }]}>
              Supprimer son compte
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text>{error}</Text>
    </SafeAreaView>
  );
}
const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    topPage: {
      marginBottom: 10,
      alignItems: "center",
      gap: 12,
    },
    message: {
      color: colors.textAccent,
      fontSize: 16,
      fontWeight: 400,
    },
    editUsernameSection: {
      justifyContent: "center",
      borderBottomWidth: 0.5,
      borderColor: colors.textMyMood,
      marginTop: 10,
      height: 70,
    },
    textEdit: {
      color: colors.textAccent,
      marginLeft: 5,
      fontSize: 15,
    },
    editUsername: {
      width: 310,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingRight: 5,
      marginBottom: 5,
    },
    editPassSection: {
      marginVertical: 5,
      justifyContent: "center",
      width: "100%",
    },
    editPass: {
      width: 310,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingRight: 5,
    },
    subtext: {
      color: colors.textGeneral,
      fontSize: 17,
      fontWeight: "400",
      letterSpacing: 0.3,
    },
    settings: {
      fontSize: 25,
      color: colors.textMyMood,
    },
    reglages: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
    infoUser: {
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      height: "auto",
    },
    mode: {
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      height: 110,
    },
    quitte: {
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      height: 110,
    },
    bouton: {
      width: "100%",
      height: 50,
      backgroundColor: "transparent",
      justifyContent: "center",
      paddingLeft: 15,
    },
    input: {
      width: 225,
      height: 40,
      paddingLeft: 5,
      color: colors.textGeneral,
      backgroundColor: colors.inputBackground,
      margin: 5,
      borderRadius: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: colors.background,
      borderRadius: 12,
      alignItems: "center",
    },
    boutonsModale: {
      marginTop: 20,
      flexDirection: "row",
      gap: 12,
    },
    boutonModale: {
      width: 50,
      height: 30,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    textStyle: {
      color: colors.white,
      fontWeight: "500",
      letterSpacing: 0.2,
    },
  });
