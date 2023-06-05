import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import { groupsReducer } from "renderer/store/reducers/groups/slice";

const rootReducer = combineReducers({
  groupsReducer
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer
  });
};

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
