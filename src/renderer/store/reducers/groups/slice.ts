import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GroupI } from "renderer/types/groups";
import { ConnectionI } from "renderer/types/connection";
import { date } from "zod";
import { findIndex } from "lodash";

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

    edit(state, action: PayloadAction<{ index: number, data: GroupI }>) {
      const index = action.payload.index;
      state.groups[index] = action.payload.data;
    },

    remove(state, action: PayloadAction<number>) {
      const index = action.payload;
      state.groups.splice(index, 1);
    },

  }
});

export const groupsReducer = groupsSlice.reducer;
