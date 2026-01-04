import { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationContext = createContext();

const ENABLED_KEY = "notificationsEnabled";
const TIME_KEY = "notificationTime";

//heure par defaut
const DEFAULT_TIME = { hour: 20, minute: 0 };

export const NotificationProvider = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState(DEFAULT_TIME);

  useEffect(() => {
    const init = async () => {
      const savedEnabled = await AsyncStorage.getItem(ENABLED_KEY);
      const savedTime = await AsyncStorage.getItem(TIME_KEY);

      if (savedEnabled !== null) {
        setNotificationsEnabled(savedEnabled === "true");
      }

      if (savedTime) {
        setNotificationTime(JSON.parse(savedTime));
      }
    };

    init();
  }, []);

  // Sauvegarde ON/OFF
  useEffect(() => {
    AsyncStorage.setItem(ENABLED_KEY, notificationsEnabled.toString());
  }, [notificationsEnabled]);

  //Programmer / annuler
  useEffect(() => {
    const sync = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (notificationsEnabled) {
        await scheduleDailyNotification(notificationTime);
      }
    };

    sync();
  }, [notificationsEnabled, notificationTime]);

  // Programmer la notification
  const scheduleDailyNotification = async (time) => {
    const now = new Date();
    const trigger = new Date();

    trigger.setHours(time.hour, time.minute, 0, 0);

    if (trigger <= now) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Note ta journée",
        body: "Pense à enregistrer ton Mood",
      },
      trigger: {
        type: "date",
        date: trigger,
      },
    });
  };

  //Permission
  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };

  // Toggle ON/OFF
  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    setNotificationsEnabled((prev) => !prev);
  };

  //Modifier l'heure
  const updateNotificationTime = async (date) => {
    const newTime = {
      hour: date.getHours(),
      minute: date.getMinutes(),
    };

    setNotificationTime(newTime);
    await AsyncStorage.setItem(TIME_KEY, JSON.stringify(newTime));
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        toggleNotifications,
        notificationTime,
        updateNotificationTime,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
