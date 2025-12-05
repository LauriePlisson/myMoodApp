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
  },
});

export const {
  setSelectedMood,
  setMoodOfTheDay,
  unSelectMood,
  resetMoodOfTheDay,
} = moodsSlice.actions;
export default moodsSlice.reducer;
