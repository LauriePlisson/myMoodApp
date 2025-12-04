export const lightTheme = {
  mode: "light",
  colors: {
    background: "#f4f4f4ff",
    cardBackground: "#e9d5e3ff", //"#d8becbff",
    inputBackground: "#efe1ebff",
    buttonBackground: "#c890b5ff",
    textAccent: "#a37794ff",
    textMyMood: "#A48A97",
    textGeneral: "#544c5bff",
    textPlaceHolder: "#727272a9",
    whiteBlack: "white",
    whiteWhite: "white",
    number: "#544c5bff",

    //GrafColors
    axesColor: "#D8BECB",
    dotColor: "#f1bde1e5",
    courbeColor: "#e6c4dcbc",
    startFill: "rgba(245, 123, 190, 1)",
    endFill: "#efd1f2ff",

    //moods
  },
};

export const darkTheme = {
  mode: "dark",
  colors: {
    background: "#121314ff",
    cardBackground: "#1c1b1dff", //"#d8becbff",
    inputBackground: "#2f2d31cb",
    buttonBackground: "#a48299ff",
    textAccent: "#a37794ff",
    textMyMood: "#A48A97",
    textGeneral: "#706d75ff",
    whiteBlack: "black",
    whiteWhite: "white",
    number: "#a37794ff",

    //GrafColors
    axesColor: "#D8BECB",
    dotColor: "#af96a8e5",
    courbeColor: "#e6c4dcbc",
    startFill: "rgba(246, 163, 208, 1)",
    endFill: "#efd1f2ff",
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;
