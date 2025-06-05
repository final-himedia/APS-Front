"use client";

import { useState } from "react";
import ListDivider from "./standard/ListDivider";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = 250;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {isSidebarOpen && (
        <div
          style={{
            width: sidebarWidth,
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            backgroundColor: "#fff",
            borderRight: "1px solid #ccc",
            zIndex: 1100,
          }}
        >
          <ListDivider onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      <div style={{ marginLeft: isSidebarOpen ? sidebarWidth : 0, flex: 0.5 }}>
        {/* 상단바 */}
        <div
          style={{
            height: 40,
            backgroundColor: "#fff",
            borderBottom: "1px solid #ccc",
            borderLeft: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            position: "fixed",
            top: 0,
            left: isSidebarOpen ? sidebarWidth : 0,
            right: 0,
            zIndex: 1200,
          }}
        >
          {!isSidebarOpen && (
            <IconButton onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </div>

        <main style={{ marginTop: 20, padding: 16 }}>{children}</main>
      </div>
    </div>
  );
}
