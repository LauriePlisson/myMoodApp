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
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SettingsModal({
  visible,
  setModalVisible,
  modalMsg,
  handlePressNon,
  handlePressOui,
  openFrom,
  notificationTime,
}) {
  const { colors } = useTheme();
  const s = styles(colors);
  const [tempDate, setTempDate] = useState(
    new Date(0, 0, 0, notificationTime.hour, notificationTime.minute)
  );

  useEffect(() => {
    if (openFrom === "Notif") {
      setTempDate(
        new Date(0, 0, 0, notificationTime.hour, notificationTime.minute)
      );
    }
  }, [openFrom, notificationTime]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.modalOverlay}>
          <View
            style={[
              s.modalContent,
              {
                height: openFrom === "Notif" ? 260 : "auto",
                width: openFrom === "Notif" ? 290 : 280,
                justifyContent: "center",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                handlePressNon();
              }}
              style={[s.closeBtn, { marginBottom: 10 }]}
            >
              <X
                size={20}
                color={colors.buttonBackground}
                style={{ fontWeight: "bold" }}
              />
            </TouchableOpacity>

            <Text
              style={[s.title, { fontWeight: openFrom === "Notif" && "500" }]}
            >
              {openFrom !== "Notif" ? "Es-tu sûr de vouloir" : modalMsg}
            </Text>

            {openFrom !== "Notif" && (
              <Text
                style={[
                  s.title,
                  { color: colors.textAccent, marginBottom: 15 },
                ]}
              >
                {modalMsg}
              </Text>
            )}
            {openFrom === "Notif" && (
              <DateTimePicker
                value={tempDate}
                mode="time"
                is24Hour={true}
                display="spinner"
                timeZoneName={"Europe/Prague"}
                style={{
                  maxWidth: 250,
                  maxHeight: 120,
                  // textAccent: colors.textAccent,
                }}
                textColor={colors.textAccent}
                onChange={(event, date) => {
                  if (date) setTempDate(date);
                }}
              />
            )}

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => handlePressNon()}
                style={[
                  s.addBtn,
                  {
                    borderWidth: 1,
                    borderColor: colors.inputBackground,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Text style={[s.addText, { color: colors.textGeneral }]}>
                  Annuler
                </Text>
                {/* <Check size={20} color={colors.whiteBlack} /> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePressOui(tempDate)}
                style={s.addBtn}
              >
                <Text style={s.addText}>Valider</Text>
              </TouchableOpacity>
              {/* <Check size={20} color={colors.whiteBlack} /> */}
            </View>
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
      paddingBottom: 40,
    },
    modalContent: {
      // width: 270,
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
