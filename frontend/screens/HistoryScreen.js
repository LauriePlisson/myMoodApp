import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text>HistoryScreen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
  },
});
