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

export default function SettingsModal({
  visible,
  setModalVisible,
  modalMsg,
  handlePressNon,
  handlePressOui,
}) {
  const { colors } = useTheme();
  const s = styles(colors);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <TouchableOpacity
              onPress={() => {
                handlePressNon();
              }}
              style={s.closeBtn}
            >
              <X size={20} color={colors.textAccent} />
            </TouchableOpacity>
            <Text style={s.title}>Es-tu sûr de vouloir </Text>
            <Text
              style={[s.title, { color: colors.textAccent, marginBottom: 10 }]}
            >
              {modalMsg}
            </Text>
            <TouchableOpacity onPress={() => handlePressOui()} style={s.addBtn}>
              <Text style={s.addText}>Valider</Text>
              {/* <Check size={20} color={colors.whiteBlack} /> */}
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
      //   marginBottom: 15,
    },
    addBtn: {
      marginTop: 10,
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: colors.buttonBackground,
      borderRadius: 20,
    },
    addText: {
      color: colors.whiteBlack,
      fontSize: 16,
    },
  });
