import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IEnvironment } from "renderer/types/environment";

interface EnvironmentsState {
  isLoading: boolean,
  environments: IEnvironment[] | undefined,
  currentEnvironmentId?: string
}

const initialState: EnvironmentsState = {
  isLoading: true,
  environments: []
};

export const environmentsSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {

    update(state, action: PayloadAction<IEnvironment[]>) {
      state.environments = action.payload;
      state.isLoading = false;
    },

    add(state, action: PayloadAction<IEnvironment>) {
      state.environments = [
        ...(state.environments ?? []),
        action.payload
      ];
    },

    setCurrentEnvironmentId(state, action: PayloadAction<string>) {
      state.currentEnvironmentId = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }

  }
});

export const environmentsReducer = environmentsSlice.reducer;
