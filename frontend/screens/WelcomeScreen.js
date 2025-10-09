import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>WelcomeScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("TabNavigator");
        }}
      >
        <Text>Go To Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
});
