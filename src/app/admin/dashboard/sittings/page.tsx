"use client";

import { useState } from "react";
import { Tabs, Tab, Box, useTheme } from "@mui/material";
import CategorySettings from "./categorySitting";

export default function SittingsPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="py-4 px-1 md:px-10">
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
        }}
        className="shadow-md"
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          className="border-b"
        >
          <Tab label="الفئات" />
          <Tab label="الاشعارات" />
        </Tabs>

        <div className="p-4">
          {tabIndex === 0 && <CategorySettings />}
          {/* تبويبات إضافية يمكن إضافتها لاحقًا مثل: tabIndex === 1 && <GeneralSettings /> */}
        </div>
      </Box>
    </div>
  );
}
