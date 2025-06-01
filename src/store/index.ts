import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./features/ex";
import authReducer from "./features/Auth/authSlice";
import themeReducer from "./features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
