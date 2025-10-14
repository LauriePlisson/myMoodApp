import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    username: "",
    token: "",
    isLoggedIn: false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
      state.value.isLoggedIn = true;
    },
    logOut: (state) => {
      state.value.username = "";
      state.value.token = "";
      state.value.isLoggedIn = false;
    },
    changeUsername: (state, action) => {
      state.value.username = action.payload;
    },
  },
});

export const { logIn, logOut, changeUsername } = userSlice.actions;
export default userSlice.reducer;
