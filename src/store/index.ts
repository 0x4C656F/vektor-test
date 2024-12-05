import { configureStore } from "@reduxjs/toolkit";
import draftsReducer from "./drafts";
import logsReducer from "./logs";
const store = configureStore({
  reducer: {
    drafts: draftsReducer,
    logs: logsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
