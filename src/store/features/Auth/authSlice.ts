import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone_num: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
}

interface LoginPayload {
  user: User;
  token: string;
}

let userFromStorage: User | null = null;

if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      userFromStorage = JSON.parse(storedUser);
    } catch (e) {
      console.warn("Failed to parse user from localStorage:", e);
      localStorage.removeItem("user");
    }
  }
}

const initialState: AuthState = {
  user: userFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginPayload>) {
      const { user, token } = action.payload;
      state.user = user;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        Cookies.set("token", token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
      }
    },
    logout(state) {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        Cookies.remove("token");
        window.location.replace("/");
      }
    },
  },
});

export const IsLoggedIn = (state: { auth: AuthState }) => !!state.auth.user;
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
