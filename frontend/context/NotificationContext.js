import { createContext, useContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Handler global pour Expo (même si app ouverte au premier plan)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const STORAGE_KEY = "notificationsEnabled";

  // Charger l'état au lancement
  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Lire le choix utilisateur
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setNotificationsEnabled(saved === "true");
        }

        // 2️⃣ Vérifier la permission système
        const system = await Notifications.getPermissionsAsync();
        const granted = system.status === "granted";

        // Si refus iOS → toggle OFF
        if (!granted) {
          setNotificationsEnabled(false);
          await AsyncStorage.setItem(STORAGE_KEY, "false");
        }
      } catch (e) {
        console.error("Erreur init notifications", e);
      }
    };

    init();
  }, []);

  // Sauvegarde automatique du choix utilisateur
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, notificationsEnabled.toString());
  }, [notificationsEnabled]);

  // Programmer / annuler selon l'état
  useEffect(() => {
    const updateNotifications = async () => {
      if (notificationsEnabled) {
        await scheduleDailyNotification();
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    };

    updateNotifications();
  }, [notificationsEnabled]);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };

  const scheduleDailyNotification = async () => {
    const now = new Date();
    let trigger = new Date();
    trigger.setHours(20, 0, 0, 0); // 20h aujourd'hui

    if (trigger <= now) {
      trigger.setDate(trigger.getDate() + 1); // demain si l'heure est passée
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

  const toggleNotifications = async () => {
    // Si on active → vérifier permission
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (!granted) {
        setNotificationsEnabled(false);
        return;
      }
    }

    // Bascule ON/OFF
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        toggleNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
