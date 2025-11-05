export const lightTheme = {
  mode: "light",
  colors: {
    background: "#f4f4f4ff",
    card: "#d8becbff",
    text: "#696773",
    subtext: "#7d7084ff",
    primary: "#A48A97",
    secondary: "#403e4aff",
    accent: "#c18d9eff",
    backgroundSettingsCards: "#d8becbff",
    input: "#faecf0e9",
    bouton: "#ceafbeff",
    borderInputColor: "#ceafbeff",
  },
  // tokens utilitaires (optionnel)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
  },
};

export const darkTheme = {
  mode: "dark",
  colors: {
    background: "#121314ff",
    card: "#211f22ff",
    text: "#A48A97",
    subtext: "#836876ff",
    primary: "#725d68ff",
    secondary: "#605e6aff",
    backgroundSettingsCards: "#211f22ff",
    input: "#39353ed8",
    bouton: "#ae97a2ff",
    borderInputColor: "#917e87ff",
    accent: "#c18d9eff",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
  },
};

// util export pratique
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;
