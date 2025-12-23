import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { TouchableOpacity } from "react-native";
import SettingsScreen from "../screens/SettingsScreen";
import { ChevronLeft } from "lucide-react-native";

const Stack = createNativeStackNavigator();

export default function ThemedSettingsStack({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsStack"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTintColor: "#B4A6AB",
          headerShadowVisible: false,
          headerStyle: {
            height: 110,
            backgroundColor: isDark ? "#211f22ff" : "#edeaefff",
            elevation: 0,
            shadowColor: "transparent",
            borderBottomWidth: 0,
          },
          headerBackTitleVisible: false,
          title: "MyMood",
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: "600",
            color: "#B4A6AB",
            paddingBottom: 10,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={30} color={"#B4A6AB"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
