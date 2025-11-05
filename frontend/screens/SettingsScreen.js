import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, changeUsername } from "../reducers/user";
import { useTheme } from "../context/ThemeContext";

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
      // Toast.show({
      //   type: "success",
      //   text1: "Succès",
      //   text2: "Les changements ont été effectués ✅",
      //   position: "center",
      // });
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
    if (openFrom === "LogOut") {
      handleLogOut();
    }
    if (openFrom === "Delete") {
      handleDelete();
    }
    if (openFrom === "Edit") {
      handleEdit();
      setModalVisible(false);
    }
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
            <Text>Es tu sure?</Text>
            <View style={s.boutonsModale}>
              <TouchableOpacity
                style={[s.boutonModale, { backgroundColor: "#fceaf0ff" }]}
                onPress={() => handlePressOui()}
              >
                <Text style={s.textStyle}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.boutonModale, { backgroundColor: "#d8becbff" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={s.textStyle}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={s.text}>
        <Text style={s.settings}>Réglages</Text>
        <Text style={{ color: "#A48A97", fontWeight: 125 }}>
          {succesMessage}
        </Text>
      </View>
      <View style={s.reglages}>
        <View style={s.infoUser}>
          {editUsername && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setEditUsername(false);
                  setNewUsername("");
                }}
                style={s.exit}
              >
                <Text style={{ fontWeight: "bold", color: colors.subtext }}>
                  X
                </Text>
              </TouchableOpacity>
              <TextInput
                style={s.input}
                placeholderTextColor={colors.subtext}
                placeholder={user.username}
                value={newUsername}
                onChangeText={(value) => setNewUsername(value)}
              ></TextInput>

              <Text>{errorEdit}</Text>
            </>
          )}
          <TouchableOpacity
            style={[
              s.bouton,
              { borderBottomColor: "#A48A97", borderBottomWidth: 0.5 },
            ]}
            onPress={() => {
              if (!editUsername) {
                setEditUsername(true);
              } else {
                setModalVisible(true);
                setOpenFrom("Edit");
              }
            }}
          >
            <Text style={s.subtext}>
              {!editUsername ? "Change Username" : "Valider"}
            </Text>
          </TouchableOpacity>
          {editPassword && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setEditPassword(false);
                  setNewPassword("");
                  setOldPassword("");
                }}
                style={s.exit}
              >
                <Text style={{ fontWeight: "bold", color: colors.subtext }}>
                  X
                </Text>
              </TouchableOpacity>
              <TextInput
                style={[s.input, { marginBottom: 5 }]}
                placeholder="Password"
                value={oldPassword}
                placeholderTextColor={colors.subtext}
                onChangeText={(value) => setOldPassword(value)}
                secureTextEntry={true}
              ></TextInput>
              <TextInput
                style={[s.input]}
                placeholder="New Password"
                placeholderTextColor={colors.subtext}
                value={newPassword}
                onChangeText={(value) => setNewPassword(value)}
                secureTextEntry={true}
              ></TextInput>
              <Text>{errorEdit}</Text>
            </>
          )}
          <TouchableOpacity
            style={s.bouton}
            onPress={() => {
              if (!editPassword) {
                setEditPassword(true);
              } else {
                setModalVisible(true);
                setOpenFrom("Edit");
              }
            }}
          >
            <Text style={s.subtext}>
              {!editPassword ? "Change Password" : "Valider"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={s.mode}>
          <TouchableOpacity
            style={[
              s.bouton,
              {
                borderBottomColor: "#A48A97",
                borderBottomWidth: 0.5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 15,
              },
            ]}
          >
            <Text style={s.subtext}>Notifications</Text>
            <Switch style={{ marginTop: 10 }}></Switch>
          </TouchableOpacity>
          <TouchableOpacity
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
            <Text style={s.subtext}>Dark Mode</Text>
            <Switch
              onValueChange={toggleTheme}
              value={theme === "dark"}
              style={{ marginTop: 10 }}
              trackColor={{ false: "#767577", true: "#2e3034ff" }}
              thumbColor={theme === "dark" ? "#A48A97" : "#f4f3f4"}
            ></Switch>
          </TouchableOpacity>
        </View>
        <View style={s.quitte}>
          <TouchableOpacity
            style={[
              s.bouton,
              { borderBottomColor: "#A48A97", borderBottomWidth: 0.5 },
            ]}
            onPress={() => {
              setModalVisible(true);
              setOpenFrom("LogOut");
            }}
          >
            <Text style={s.subtext}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.bouton]}
            onPress={() => {
              setModalVisible(true);
              setOpenFrom("Delete");
            }}
          >
            <Text style={s.subtext}>Delete Account</Text>
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
    text: {
      marginBottom: 10,
      alignItems: "center",
      gap: 15,
    },
    subtext: {
      color: colors.subtext,
      fontSize: 17,
      fontWeight: "400",
      letterSpacing: 0.3,
    },
    settings: {
      fontSize: 25,
      color: colors.accent,
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
      backgroundColor: colors.backgroundSettingsCards,
      borderRadius: 10,
      height: "auto",
    },
    exit: {
      marginLeft: 240,
      marginTop: 10,
      marginBottom: 0,
      width: 45,
      height: 25,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    mode: {
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundSettingsCards,
      borderRadius: 10,
      height: 110,
    },
    quitte: {
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundSettingsCards,
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
      paddingLeft: 10,
      backgroundColor: colors.input,
      borderRadius: 15,
      width: "80%",
      height: 40,
      borderBottomWidth: 0.2,
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
      backgroundColor: "#ffffffea",
      borderRadius: 12,
      alignItems: "center", // centre le contenu à l'intérieur du cadre
    },
    boutonsModale: {
      marginTop: 15,
      flexDirection: "row",
      gap: 15,
    },
    boutonModale: {
      width: 50,
      height: 30,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
  });
