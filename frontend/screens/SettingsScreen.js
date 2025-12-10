import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, changeUsername } from "../reducers/user";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { Check, X } from "lucide-react-native";
import SettingsModal from "../components/SettingsModal";

export default function SettingsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [openFrom, setOpenFrom] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [succesMessage, setSuccesMessage] = useState("");
  const [error, setError] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editType, setEditType] = useState("");
  const [errorEditPassword, setErrorEditPassword] = useState("");
  const [errorEditUsername, setErrorEditUsername] = useState("");

  const { notificationsEnabled, toggleNotifications } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const user = useSelector((state) => state.user.value);

  const { colors } = useTheme();
  const s = styles(colors);

  const usernameInputRef = useRef(null);
  const oldPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);

  const handleEdit = async (type) => {
    if (type === "username" && newUsername === "") {
      setErrorEditUsername(
        "Entre un nouveau nom d'utilisateur avant de valider"
      );
      setTimeout(() => setErrorEditUsername(""), 5000);
      setNewUsername("");
      return;
    }
    if (type === "password" && (oldPassword === "" || newPassword === "")) {
      setErrorEditPassword("Tous les champs de mot de passe sont obligatoires");
      setTimeout(() => setErrorEditPassword(""), 5000);
      // setNewPassword("");
      setOldPassword("");
      return;
    }
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
    console.log(data);
    if (data.error) {
      setErrorEditPassword(data.error);
      setTimeout(() => setErrorEditPassword(""), 5000);
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
    // console.log("handlePressOui");
    setModalVisible(false);
    if (openFrom === "LogOut") {
      handleLogOut();
    }
    if (openFrom === "Delete") {
      handleDelete();
    }
    if (openFrom === "Edit") {
      handleEdit(editType);
    }
  };

  const handlePressNon = () => {
    // console.log("handlePressNon");
    setModalVisible(false);
    if (openFrom === "Edit")
      setSuccesMessage("Modification annulée"),
        setTimeout(() => setSuccesMessage(""), 3000);
    if (openFrom === "LogOut" || openFrom === "Delete")
      setSuccesMessage("Annulé"), setTimeout(() => setSuccesMessage(""), 3000);
  };

  const openModal = (from, msg, type) => {
    setOpenFrom(from);
    setModalMsg(msg);
    setModalVisible(true);
    if (type) setEditType(type);
  };

  return (
    <SafeAreaView style={s.container}>
      <SettingsModal
        setModalVisible={setModalVisible}
        modalMsg={modalMsg}
        visible={modalVisible}
        handlePressNon={handlePressNon}
        handlePressOui={handlePressOui}
      />
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.textModal}>Es-tu sure de vouloir </Text>
            <Text style={[s.textModal, { color: colors.textAccent }]}>
              {modalMsg}
            </Text>
            <View style={s.boutonsModale}>
              <TouchableOpacity
                style={[s.boutonModale, { backgroundColor: "#c890b5ff" }]} //"#d8becbff"
                onPress={() => {
                  handlePressNon();
                }}
              >
                <Text style={s.textStyle}>Non</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.boutonModale, { backgroundColor: "#e9d5e3ff" }]} //"#fceaf0ff"
                onPress={() => handlePressOui()}
              >
                <Text style={s.textStyle}>Oui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, alignItems: "center" }}>
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
                      ref={usernameInputRef}
                      style={[s.input]}
                      placeholderTextColor={colors.textPlaceHolder}
                      placeholder={user.username}
                      value={newUsername}
                      onChangeText={(value) => setNewUsername(value)}
                      returnKeyType="done"
                      onSubmitEditing={() =>
                        openModal(
                          "Edit",
                          "changer ton nom d'utilisateur?",
                          "username"
                        )
                      }
                      selectionColor={colors.textAccent}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        openModal(
                          "Edit",
                          "changer ton nom d'utilisateur?",
                          "username"
                        );
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
                  {errorEditUsername && (
                    <Text
                      style={[
                        s.textEdit,
                        { textAlign: "center", marginBottom: 5 },
                      ]}
                    >
                      {errorEditUsername}
                    </Text>
                  )}
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
                    setTimeout(() => {
                      usernameInputRef.current?.focus();
                    }, 100);
                  }}
                >
                  <Text style={s.subtext}>Changer de nom d'utilisateur</Text>
                </TouchableOpacity>
              )}

              {editPassword ? (
                <View style={s.editPassSection}>
                  <Text style={s.textEdit}>Mot de Passe</Text>
                  <View style={s.editPass}>
                    <View>
                      <TextInput
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          newPasswordInputRef.current?.focus()
                        }
                        ref={oldPasswordInputRef}
                        style={[s.input, { marginLeft: 10 }]}
                        placeholder="Password"
                        value={oldPassword}
                        placeholderTextColor={colors.textPlaceHolder}
                        onChangeText={(value) => setOldPassword(value)}
                        secureTextEntry={true}
                        selectionColor={colors.textAccent}
                      />
                      <View
                        style={{
                          width: 300,
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          paddingRight: 5,
                          marginBottom: 5,
                        }}
                      >
                        <TextInput
                          ref={newPasswordInputRef}
                          style={s.input}
                          placeholder="New Password"
                          placeholderTextColor={colors.textPlaceHolder}
                          value={newPassword}
                          onChangeText={(value) => setNewPassword(value)}
                          secureTextEntry={true}
                          returnKeyType="done"
                          onSubmitEditing={() =>
                            openModal(
                              "Edit",
                              "changer ton mot de passe?",
                              "password"
                            )
                          }
                          selectionColor={colors.textAccent}
                        />

                        <TouchableOpacity
                          onPress={() => {
                            openModal(
                              "Edit",
                              "changer ton mot de passe?",
                              "password"
                            );
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
                    </View>
                  </View>
                  {errorEditPassword && (
                    <Text style={[s.textEdit, { textAlign: "center" }]}>
                      {errorEditPassword}
                    </Text>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={s.bouton}
                  onPress={() => {
                    setEditPassword(true);
                    setTimeout(() => {
                      oldPasswordInputRef.current?.focus();
                    }, 100);
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
                  {
                    borderBottomColor: colors.textMyMood,
                    borderBottomWidth: 0.5,
                  },
                ]}
                onPress={() => {
                  openModal("LogOut", "te déconnecter?");
                }}
              >
                <Text style={s.subtext}>Me déconnecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.bouton]}
                onPress={() => {
                  openModal("Delete", "supprimer ton compte?");
                }}
              >
                <Text style={[s.subtext, { color: colors.textAccent }]}>
                  Supprimer mon compte
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text>{error}</Text>
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
      justifyContent: "flex-start",
      borderBottomWidth: 0.5,
      borderColor: colors.textMyMood,
      marginTop: 5,
    },
    textEdit: {
      color: colors.textAccent,
      margin: 5,
      marginBottom: 2,
      fontSize: 15,
    },
    editUsername: {
      width: 300,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingRight: 5,
      marginBottom: 5,
    },
    editPassSection: {
      marginVertical: 5,
      justifyContent: "flex-start",
      width: "100%",
    },
    editPass: {
      width: 310,
      height: 100,
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
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
    infoUser: {
      width: 310,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      height: "auto",
    },
    mode: {
      width: 310,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      height: 110,
    },
    quitte: {
      width: 310,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      height: 110,
    },
    bouton: {
      width: 310,
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
    // textModal: {
    //   color: colors.textGeneral,
    //   fontWeight: 500,
    //   fontSize: 15,
    //   letterSpacing: 0.2,
    //   textAlign: "center",
    // },
    // boutonsModale: {
    //   marginTop: 15,
    //   flexDirection: "row",
    //   gap: 12,
    // },
    // boutonModale: {
    //   width: 50,
    //   height: 30,
    //   borderRadius: 8,
    //   alignItems: "center",
    //   justifyContent: "center",
    // },
    textStyle: {
      color: "black",
      fontWeight: "500",
      letterSpacing: 0.2,
    },
  });
