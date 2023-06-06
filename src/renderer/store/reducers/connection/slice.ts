import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ExtendedConnectionI } from "renderer/types/connection";

interface GroupsState {
  history: Array<ExtendedConnectionI>,
  activeConnection?: number
}

const initialState: GroupsState = {
  history: []
};

export const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {

    addConnection(state, action: PayloadAction<ExtendedConnectionI>) {
      state.history = [...state.history, action.payload];
    },

    removeConnection(state, action: PayloadAction<number>) {
      state.history.splice(action.payload, 1);
    },

    addMessage(state, action: PayloadAction<{ index: number, data: string }>) {
      const index = action.payload.index;
      state.history[index].messages += "\n\n" + action.payload.data;
    },

    changeActiveConnection(state, action: PayloadAction<number>) {
      state.activeConnection = action.payload;
    }

  }
});

export const connectionReducer = connectionSlice.reducer;
