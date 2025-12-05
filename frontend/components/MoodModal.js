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
import { useSelector } from "react-redux";
import { useState } from "react";
import { X, Check } from "lucide-react-native";
import { saveMoodAPI } from "../utils/moodAPI";
import { useTheme } from "../context/ThemeContext";

export default function MoodModal({
  visible,
  setModalVisible,
  date,
  selectedMood,
  setMoodsByYear,
}) {
  const [moodValue, setMoodValue] = useState("5".padStart(2, "0"));
  const [moodOfTheDay, setMoodOfTheDay] = useState(null);
  const [note, setNote] = useState("");

  const user = useSelector((state) => state.user.value);
  const { colors } = useTheme();
  const s = styles(colors);

  const reset = () => {
    setNote("");
    setMoodValue("5".padStart(2, "0"));
  };

  // --- Normalisation finale quand on quitte l'input ---
  const formatFinalValue = () => {
    if (moodValue === "" || isNaN(parseInt(moodValue))) {
      setMoodValue("00");
      return;
    }

    const n = Math.max(0, Math.min(10, parseInt(moodValue)));
    setMoodValue(n.toString().padStart(2, "0"));
  };

  // --- Gestion propre de la saisie ---
  const handleChangeMood = (text) => {
    let cleaned = text.replace(/[^0-9]/g, "");

    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2);
    }

    if (cleaned !== "") {
      const num = parseInt(cleaned);
      if (!isNaN(num) && num > 10) {
        cleaned = "10"; // clamp auto
      }
    }

    setMoodValue(cleaned);
  };

  const handleAddMood = async () => {
    const finalValue = moodValue === "" ? "00" : moodValue;

    const { mood, success } = await saveMoodAPI({
      userToken: user.token,
      existingMood: moodOfTheDay,
      moodValue: finalValue,
      note,
      date,
    });

    if (success) {
      setMoodsByYear((prev) => {
        const year = new Date(date).getFullYear();
        const moodsForYear = prev[year] ? [...prev[year]] : [];
        const index = moodsForYear.findIndex((m) => m.date === date);
        if (index !== -1) moodsForYear[index] = mood;
        else moodsForYear.push(mood);

        return { ...prev, [year]: moodsForYear };
      });

      setModalVisible(false);
      reset();
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                reset();
              }}
              style={s.closeBtn}
            >
              <X size={20} color={colors.textAccent} />
            </TouchableOpacity>
            <Text style={s.title}>Note ta journée</Text>
            <View style={s.panel}>
              <TextInput
                style={s.numberInput}
                value={moodValue}
                onChangeText={handleChangeMood}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={formatFinalValue}
                maxLength={2}
                selectTextOnFocus={true} // ← permet de remplacer directement
              />
            </View>
            <View style={s.commentSection}>
              <TextInput
                style={[
                  s.input,
                  {
                    borderBottomWidth: 0.2,
                    borderColor: colors.textGeneral,
                  },
                ]}
                placeholder="Ajoute un commentaire..."
                placeholderTextColor={colors.textPlaceHolder}
                value={note}
                selectionColor={colors.textAccent}
                onChangeText={setNote}
              />
              <TouchableOpacity onPress={Keyboard.dismiss}>
                <Check color={colors.textAccent} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setNote(""), Keyboard.dismiss();
                }}
              >
                <X color={colors.textGeneral} size={20} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleAddMood} style={s.addBtn}>
              <Text style={s.addText}>Ajouter</Text>
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
    panel: {
      marginBottom: 20,
      backgroundColor: colors.whiteBlack,
      borderRadius: 8,
      height: 90,
      justifyContent: "center",
    },
    numberInput: {
      width: 90,
      fontSize: 40,
      textAlign: "center",
      color: colors.textGeneral,
      paddingVertical: 5,
      borderRadius: 8,
    },
    commentSection: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    input: {
      width: 200,
      color: colors.textGeneral,
      paddingVertical: 8,
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
