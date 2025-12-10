import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function PasswordModal({ visible, setModalVisible }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { colors } = useTheme();
  const s = styles(colors);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={s.closeBtn}
            >
              <X size={20} color={colors.textAccent} />
            </TouchableOpacity>
            <Text style={s.title}>Mot de passe oublié?</Text>
            <TextInput
              style={[s.input]}
              placeholder="email"
              placeholderTextColor={colors.textPlaceHolder}
              value={email}
              onChangeText={(value) => setEmail(value)}
              keyboardType="email-address"
              selectionColor={colors.textAccent}
            />
            <Text>{error}</Text>
            <TouchableOpacity style={s.addBtn}>
              <Text style={s.addText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = (colors) =>
  StyleSheet.create({
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
    closeBtn: {
      alignSelf: "flex-end",
    },
    title: {
      fontSize: 18,
      color: colors.textGeneral,
      textAlign: "center",
      marginBottom: 15,
    },
    input: {
      width: 200,
      height: 40,
      textAlign: "center",
      color: colors.textGeneral,
      backgroundColor: colors.inputBackground,
      margin: 5,
      borderRadius: 8,
    },
    commentSection: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    addBtn: {
      marginTop: 10,
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: colors.buttonBackground,
      borderRadius: 8,
    },
    addText: {
      color: colors.background,
      fontSize: 16,
    },
  });
