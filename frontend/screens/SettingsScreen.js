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
  const dispatch = useDispatch();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const user = useSelector((state) => state.user.value);

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
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Es tu sure?</Text>
            <View style={styles.boutonsModale}>
              <TouchableOpacity
                style={[styles.boutonModale, { backgroundColor: "#fceaf0ff" }]}
                onPress={() => handlePressOui()}
              >
                <Text style={styles.textStyle}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boutonModale, { backgroundColor: "#d8becbff" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.text}>
        <Text style={styles.settings}>Settings</Text>
        <Text style={{ color: "#A48A97", fontWeight: 125 }}>
          {succesMessage}
        </Text>
      </View>
      <View style={styles.reglages}>
        <View style={styles.infoUser}>
          {editUsername && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setEditUsername(false);
                  setNewUsername("");
                }}
                style={styles.exit}
              >
                <Text style={{ fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder={user.username}
                value={newUsername}
                onChangeText={(value) => setNewUsername(value)}
              ></TextInput>

              <Text>{errorEdit}</Text>
            </>
          )}
          <TouchableOpacity
            style={[
              styles.bouton,
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
            <Text>{!editUsername ? "Change Username" : "Valider"}</Text>
          </TouchableOpacity>
          {editPassword && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setEditPassword(false);
                  setNewPassword("");
                  setOldPassword("");
                }}
                style={styles.exit}
              >
                <Text style={{ fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={oldPassword}
                onChangeText={(value) => setOldPassword(value)}
                secureTextEntry={true}
              ></TextInput>
              <TextInput
                style={[styles.input]}
                placeholder="New Password"
                value={newPassword}
                onChangeText={(value) => setNewPassword(value)}
                secureTextEntry={true}
              ></TextInput>
              <Text>{errorEdit}</Text>
            </>
          )}
          <TouchableOpacity
            style={styles.bouton}
            onPress={() => {
              if (!editPassword) {
                setEditPassword(true);
              } else {
                setModalVisible(true);
                setOpenFrom("Edit");
              }
            }}
          >
            <Text>{!editPassword ? "Change Password" : "Valider"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mode}>
          <TouchableOpacity
            style={[
              styles.bouton,
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
            <Text>Notifications</Text>
            <Switch style={{ marginTop: 10 }}></Switch>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bouton,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 15,
              },
            ]}
          >
            <Text>Dark Mode</Text>
            <Switch style={{ marginTop: 10 }}></Switch>
          </TouchableOpacity>
        </View>
        <View style={styles.quitte}>
          <TouchableOpacity
            style={[
              styles.bouton,
              { borderBottomColor: "#A48A97", borderBottomWidth: 0.5 },
            ]}
            onPress={() => {
              setModalVisible(true);
              setOpenFrom("LogOut");
            }}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bouton]}
            onPress={() => {
              setModalVisible(true);
              setOpenFrom("Delete");
            }}
          >
            <Text>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text>{error}</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    marginBottom: 10,
    alignItems: "center",
    gap: 15,
  },
  settings: {
    fontSize: 25,

    color: "#696773",
  },

  reglages: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  infoUser: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d8becbff",
    borderRadius: 10,
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
    backgroundColor: "#d8becbff",
    borderRadius: 10,
  },
  quitte: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d8becbff",
    borderRadius: 10,
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
    backgroundColor: "#e8cedbff",
    width: "80%",
    height: 40,
    borderBottomWidth: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // fond semi-transparent
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
