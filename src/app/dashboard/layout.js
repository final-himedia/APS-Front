"use client";
import { Box } from "@mui/material";

export default function DashboardLayout({ children }) {
  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        px: 4,
        py: 2,
        backgroundColor: "#f5f5f5",

        height: "100%",
        overflow: "hidden", 
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
