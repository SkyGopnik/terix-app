import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthPage } from "renderer/types/auth";

interface AuthState {
  isVisible: boolean,
  page: AuthPage
}

const initialState: AuthState = {
  isVisible: false,
  page: "login"
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setVisible(state, action: PayloadAction<boolean>) {
      state.isVisible = action.payload;
    },

    setPage(state, action: PayloadAction<AuthPage>) {
      state.page = action.payload;
    }

  }
});

export const authReducer = authSlice.reducer;
