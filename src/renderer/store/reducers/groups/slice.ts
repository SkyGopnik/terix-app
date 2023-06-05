import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupI } from "renderer/types/groups";

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

    add(state, action: PayloadAction<GroupI>) {
      state.groups = [
        ...state.groups,
        action.payload
      ];
    },

    remove(state, action: PayloadAction<number>) {
      const index = action.payload;
      delete state.groups[index];
    },

  }
});

export const groupsReducer = groupsSlice.reducer;
