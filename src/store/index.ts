import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./features/ex";
import authReducer from "./features/Auth/authSlice";
import themeReducer from "./features/theme/themeSlice";
import userReducer from "./features/admin_Store/usersSlise";
import productsReducer from "./features/products/productSlice";
import categoriesReducer from "./features/categories/categoriesSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    auth: authReducer,
    theme: themeReducer,
    users: userReducer,
    products: productsReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
