import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import { environmentsReducer } from "renderer/store/reducers/environments/slice";

const rootReducer = combineReducers({
  environmentsReducer
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
