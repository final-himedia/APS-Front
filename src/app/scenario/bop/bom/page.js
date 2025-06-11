"use client";

import Box from "@mui/material/Box";
import Toolbar from "@/app/standard/Toolbar";

export default function BopPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar />
      </Box>

      {/* 가운데 콘텐츠 (스크롤 영역 포함) */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <h2>BOM</h2>
        <p>여기에 BOM 관련 테이블 넣기</p>
      </Box>
    </Box>
  );
}
