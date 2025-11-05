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
          headerBackVisible: true,
          headerTintColor: "#B4A6AB",
          headerStyle: {
            backgroundColor: isDark ? "#211f22ff" : "#edeaefff",
          },
          headerBackTitleVisible: false,
          title: "MyMOOD",
          headerTitleStyle: {
            fontSize: 25,
            marginBottom: 15,
            color: "#B4A6AB",
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
