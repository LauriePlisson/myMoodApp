import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../reducers/user";

export default function SettingsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [openFrom, setOpenFrom] = useState("");
  const [error, setError] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const dispatch = useDispatch();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const user = useSelector((state) => state.user.value);

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
      <Text style={styles.settings}>Settings</Text>
      {editUsername && <TextInput style={styles.input}></TextInput>}
      <TouchableOpacity
        style={[
          styles.bouton,
          { borderTopEndRadius: 10, borderTopStartRadius: 10 },
        ]}
        onPress={() => setEditUsername(!editUsername)}
      >
        <Text>{!editUsername ? "Change Username" : "Valider"}</Text>
      </TouchableOpacity>
      {editPassword && (
        <>
          <TextInput style={styles.input}></TextInput>
          <TextInput
            style={[
              styles.input,
              { borderTopStartRadius: 0, borderTopEndRadius: 0 },
            ]}
          ></TextInput>
        </>
      )}
      <TouchableOpacity
        style={styles.bouton}
        onPress={() => setEditPassword(!editPassword)}
      >
        <Text>{!editPassword ? "Change Password" : "Valider"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.bouton,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <Text>Notifications</Text>
        <Switch></Switch>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.bouton,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <Text>Dark Mode</Text>
        <Switch></Switch>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bouton}
        onPress={() => {
          setModalVisible(true);
          setOpenFrom("LogOut");
        }}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.bouton,
          { borderBottomEndRadius: 10, borderBottomStartRadius: 10 },
        ]}
        onPress={() => {
          setModalVisible(true);
          setOpenFrom("Delete");
        }}
      >
        <Text>Delete Account</Text>
      </TouchableOpacity>
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
  settings: {
    fontSize: 25,
    marginBottom: 25,
  },
  bouton: {
    width: "80%",
    height: 50,
    backgroundColor: "#d8becbff",
    justifyContent: "center",
    paddingLeft: 15,
    borderBottomColor: "#A48A97",
    borderBottomWidth: 0.5,
  },
  input: {
    backgroundColor: "#fceaf0ff",
    width: "80%",
    height: 30,
    borderBottomWidth: 0.2,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
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
