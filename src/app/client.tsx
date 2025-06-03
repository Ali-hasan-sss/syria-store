"use client";
import { store, RootState } from "@/store";
import { setTheme, ThemeMode } from "@/store/features/theme/themeSlice";
import { createTheme, ThemeProvider } from "@mui/material";
import { useSelector, useDispatch, Provider } from "react-redux";
import { useEffect } from "react";

function InnerThemeWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        dispatch(setTheme(savedTheme));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(mode);
    }
  }, [mode]);

  const getMuiTheme = (mode: "light" | "dark") =>
    createTheme({
      palette: {
        mode,
      },
    });

  const muiTheme = getMuiTheme(mode);

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

export default function Client({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InnerThemeWrapper>{children}</InnerThemeWrapper>
    </Provider>
  );
}
