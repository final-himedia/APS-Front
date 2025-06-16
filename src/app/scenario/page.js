"use client";

import { Box } from "@mui/material";
import DataGridSection from "../standard/DataGridSection"; // ✅ 핵심 콘텐츠만 불러오기

export default function ScenarioPage() {
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* 시나리오 목록은 layout에서 관리, 여긴 콘텐츠만 */}
      <DataGridSection />
    </Box>
  );
}
