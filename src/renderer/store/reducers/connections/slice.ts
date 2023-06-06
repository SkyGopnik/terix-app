import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ConnectionI } from "renderer/types/connection";
import { GroupI } from "renderer/types/groups";

interface ConnectionsState {
  connections: Array<ConnectionI>
}

const initialState: ConnectionsState = {
  connections: []
};

export const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {

    set(state, action: PayloadAction<Array<ConnectionI>>) {
      state.connections = action.payload;
    },

    add(state, action: PayloadAction<ConnectionI>) {
      state.connections.push(action.payload);
    },

    edit(state, action: PayloadAction<{ index: number, data: ConnectionI }>) {
      const { index, data } = action.payload;
      state.connections[index] = data;
    },

    remove(state, action: PayloadAction<number>) {
      state.connections.splice(action.payload, 1);
    },

  }
});

export const connectionsReducer = connectionsSlice.reducer;
