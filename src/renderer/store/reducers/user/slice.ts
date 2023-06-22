import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "renderer/types/user";

interface UserState {
  user: User | null
}

const initialState: UserState = {
  user: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

  }
});

export const userReducer = userSlice.reducer;
