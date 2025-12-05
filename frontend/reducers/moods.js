import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moodsByYear: {},
  selectedMood: null,
  moodOfTheDay: null,
};

export const moodsSlice = createSlice({
  name: "moods",
  initialState,
  reducers: {
    setSelectedMood: (state, action) => {
      state.selectedMood = action.payload;
    },
    setMoodOfTheDay: (state, action) => {
      state.moodOfTheDay = action.payload;
    },
    unSelectMood: (state) => {
      state.selectedMood = null;
    },
    resetMoodOfTheDay: (state) => {
      state.moodOfTheDay = null;
    },
    updateMoodInYear: (state, action) => {
      const { mood } = action.payload;
      const year = new Date(mood.date).getFullYear();
      if (!state.moodsByYear[year]) state.moodsByYear[year] = [];
      const index = state.moodsByYear[year].findIndex(
        (m) => m.date === mood.date
      );
      if (index !== -1) state.moodsByYear[year][index] = mood;
      else state.moodsByYear[year].push(mood);
    },
    setMoodsByYear: (state, action) => {
      state.moodsByYear = {
        ...state.moodsByYear, // conserve les années déjà chargées
        ...action.payload, // ajoute/écrase l'année courante
      };
    },
    resetMoods: (state) => {
      state.moodsByYear = {};
      state.selectedMood = null;
      state.moodOfTheDay = null;
    },
  },
});

export const {
  setSelectedMood,
  setMoodOfTheDay,
  unSelectMood,
  resetMoodOfTheDay,
  updateMoodInYear,
  setMoodsByYear,
  resetMoods,
} = moodsSlice.actions;
export default moodsSlice.reducer;
