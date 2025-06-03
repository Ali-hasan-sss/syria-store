import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleTheme } from "@/store/features/theme/themeSlice";
import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", mode);
    }
  }, [mode]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <IconButton
      onClick={handleThemeToggle}
      color="inherit"
      aria-label="toggle theme"
    >
      {mode === "dark" ? (
        <LightModeIcon className="text-secondary" />
      ) : (
        <DarkModeIcon className="text-secondary" />
      )}
    </IconButton>
  );
}
