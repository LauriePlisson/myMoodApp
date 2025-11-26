import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import user from "./reducers/user";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import { TouchableOpacity } from "react-native";
import { Settings, SmilePlus, History } from "lucide-react-native";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";
import ThemedSettingsStack from "./components/ThemedSettingsStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const reducers = combineReducers({ user });
const persistConfig = { key: "MyMood", storage: AsyncStorage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

const TabNavigator = ({ navigation }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
        tabBarActiveTintColor: "#c18d9eff", //"#A48A97",
        tabBarStyle: {
          backgroundColor: isDark ? "#211f22ff" : "#edeaefff",
          borderTopColor: isDark ? "#3a3a3c" : "#ddd",
        },
        headerStyle: {
          backgroundColor: isDark ? "#211f22ff" : "#edeaefff",
          shadowColor: "transparent",
          elevation: 0,
          borderBottomWidth: 0,
        },
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
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen name="Settings" component={ThemedSettingsStack} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
