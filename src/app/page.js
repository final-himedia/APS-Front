"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EastIcon from "@mui/icons-material/East";

import ListDivider from "./standard/ListDivider";
import ScenarioList from "./standard/ScenarioList";

import DataGridSection from "./standard/DataGridSection";
import InputDataPanel from "./dashboard/InputDataPanel";
import Header from "./dashboard/Header"; // 👈 새로 만든 헤더 import
import Schedule from "./dashboard/Schedule";

export default function Page() {
  const [showSidebar, setShowSidebar] = useState(true);

  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* 🔹 상단 헤더 */}
      <Header />

      {/* 🔸 하단 레이아웃 */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {showSidebar ? (
          <Box sx={{ width: 280 }}>
            <ListDivider
              onClose={() => setShowSidebar(false)}
              setSelectedMenu={setSelectedMenu}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: 40,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              pt: 1,
              borderRight: "1px solid #ccc",
            }}
          >
            <IconButton onClick={() => setShowSidebar(true)}>
              <EastIcon />
            </IconButton>
          </Box>
        )}

        <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
          <Box sx={{ width: 260, borderRight: "1px solid #ccc" }}>
            <ScenarioList setSelectedMenu={setSelectedMenu} />
          </Box>
          <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
            {selectedMenu === "schedule" ? <Schedule /> : <DataGridSection />}
          </Box>
          <Box sx={{ width: 260, borderRight: "1px solid #ccc" }}>
            <InputDataPanel />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
