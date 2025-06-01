import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleTheme } from "@/store/features/theme/themeSlice";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";

export default function CustomizedSwitches() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch checked={themeMode === "dark"} onChange={handleThemeToggle} />
        }
        label=""
      />
    </FormGroup>
  );
}
