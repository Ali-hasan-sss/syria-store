"use client";
import { store, RootState } from "@/store";
import { setTheme } from "@/store/features/theme/themeSlice";
import { createTheme, ThemeProvider } from "@mui/material";
import { useSelector, useDispatch, Provider } from "react-redux";
import { useEffect } from "react";

function InnerThemeWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default function Client({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InnerThemeWrapper>{children}</InnerThemeWrapper>
    </Provider>
  );
}
