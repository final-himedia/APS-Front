"use client";

import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import InputDataPanel from "./standard/InputDataPanel";
import ListDivider from "./standard/ListDivider";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isInputSidebarOpen, setInputSidebarOpen] = useState(true);

  const sidebarWidth = 250;
  const inputPanelWidth = 300;
  const topBarHeight = 40;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽 사이드바 */}
      {isSidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: sidebarWidth,
            height: "100vh",
            backgroundColor: "#fff",
            borderRight: "1px solid #ccc",
            zIndex: 1100,
          }}
        >
          <ListDivider onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div
        style={{
          marginLeft: isSidebarOpen ? sidebarWidth : 0,
          marginRight: isInputSidebarOpen ? inputPanelWidth : 0,
          flex: 1,
          transition: "margin 0.3s ease-in-out",
        }}
      >
        {/* 상단바 */}
        <div
          style={{
            height: topBarHeight,
            backgroundColor: "#fff",
            borderBottom: "1px solid #ccc",
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

        {/* 콘텐츠 */}
        <main style={{ marginTop: topBarHeight, padding: 16 }}>{children}</main>
      </div>
    </div>
  );
}
