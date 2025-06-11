"use client";

import DataGridSection from "../standard/DataGridSection";
import Box from "@mui/material/Box";
import Toolbar from "../standard/Toolbar";

export default function ScenarioPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar />
      </Box>

      {/* 가운데 콘텐츠 (스크롤 영역 포함) */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <DataGridSection />
      </Box>
    </Box>
  );
}
