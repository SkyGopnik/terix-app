import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GroupI } from "renderer/types/groups";
import { ConnectionI } from "renderer/types/connection";

interface GroupsState {
  groups: Array<GroupI>
}

const initialState: GroupsState = {
  groups: []
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {

    set(state, action: PayloadAction<Array<GroupI>>) {
      state.groups = action.payload;
    },

    add(state, action: PayloadAction<GroupI>) {
      state.groups = [
        ...state.groups,
        action.payload
      ];
    },

    update(state, action: PayloadAction<{ index: number, data: GroupI }>) {
      const index = action.payload.index;
      state.groups[index] = action.payload.data;
    },

    remove(state, action: PayloadAction<number>) {
      const index = action.payload;
      delete state.groups[index];
    },

    addConnection(state, action: PayloadAction<{ groupIndex: number, data: ConnectionI }>) {
      const index = action.payload.groupIndex;
      const group = state.groups[index];

      group.connections = [
        ...group.connections || [],
        action.payload.data
      ];
    }

  }
});

export const groupsReducer = groupsSlice.reducer;
