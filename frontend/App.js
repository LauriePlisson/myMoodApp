import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Settings, SmilePlus, History } from "lucide-react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const store = configureStore({
  reducer: { user },
});

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <SmilePlus size={24} color={color} />;
          } else if (route.name === "History") {
            return <History size={24} color={color} />;
          }
        },
        tabBarInactiveTintColor: "#B4A6AB",
        tabBarActiveTintColor: "#A48A97",
        headerTitle: "MyMood",
        headerTitleStyle: { fontSize: 35, paddingBottom: 10, color: "#B4A6AB" },
        headerRight: () => {
          return (
            <TouchableOpacity
              style={{ marginRight: 30, marginBottom: 30 }}
              onPress={() => navigation.navigate("Settings")}
            >
              <Settings size={24} color={"#B4A6AB"} />
            </TouchableOpacity>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShow: false }}
          />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerBackVisible: true,
              headerTintColor: "#B4A6AB",
              headerBackTitleVisible: false,
              title: "MyMOOD",
              headerTitleStyle: {
                fontSize: 25,
                marginBottom: 15,
                color: "#B4A6AB",
              },
              // headerStyle: { height: "50" },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
