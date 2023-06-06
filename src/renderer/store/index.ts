import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import { groupsReducer } from "renderer/store/reducers/groups/slice";
import { connectionReducer } from "renderer/store/reducers/connection/slice";
import { connectionsReducer } from "renderer/store/reducers/connections/slice";

const rootReducer = combineReducers({
  groupsReducer,
  connectionReducer,
  connectionsReducer
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

