import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import pendingGamesReducer from "./pendingGamesSlice";
import ongoingGamesReducer from "./ongoingGamesSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    pendingGames: pendingGamesReducer,
    ongoingGames: ongoingGamesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
