import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { useState } from "react";
import { X } from "lucide-react-native";
import { saveMoodAPI } from "../utils/moodAPI";
import { useTheme } from "../context/ThemeContext";

export default function MoodModal({ visible, setModalVisible }) {
  const [moodValue, setMoodValue] = useState("05");
  const [moodOfTheDay, setMoodOfTheDay] = useState(null);
  const [note, setNote] = useState("");
  const user = useSelector((state) => state.user.value);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { colors } = useTheme();
  const s = styles(colors);

  const handleAddMood = async () => {
    const { mood, success, message } = await saveMoodAPI({
      userToken: user.token,
      existingMood: moodOfTheDay,
      moodValue,
      note,
    });
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <X size={20} color={colors.textAccent} />
          </TouchableOpacity>
          <Text>Note ta journée</Text>
          <View style={s.panel}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={(value) => setMoodValue(value)}
              value={moodValue}
            />
            {/* {Number(moodValue).toString().padStart(2, "0")}
            </Text> */}
          </View>
          <TextInput
            style={[
              s.input,
              {
                borderBottomWidth: 0.2,
                width: 250,
                borderColor: colors.textGeneral,
              },
            ]}
            placeholder="Ajoute un commentaire..."
            placeholderTextColor={colors.textPlaceHolder}
            value={note}
            selectionColor={colors.textAccent}
            onChangeText={(value) => setNote(value)}
          />
          <TouchableOpacity onPress={() => handleAddMood()}>
            <Text>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  });
