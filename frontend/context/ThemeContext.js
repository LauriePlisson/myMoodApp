import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { lightTheme, darkTheme } from "../theme/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");

        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          const systemTheme = Appearance.getColorScheme();
          setTheme(systemTheme === "dark" ? "dark" : "light");
        }
      } catch (error) {
        console.warn("Erreur lors du chargement du thème :", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  if (isLoading) return null;

  return (
    <ThemeContext.Provider
      value={{ theme, colors: currentTheme.colors, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
