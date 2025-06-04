
"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EastIcon from "@mui/icons-material/East";

import ListDivider from "./standard/ListDivider";
import ScenarioList from "./standard/ScenarioList";

import DataGridSection from "./standard/DataGridSection";

export default function Page() {
  const [showSidebar, setShowSidebar] = useState(true);
  
  return ( 
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* 사이드바 or 열기 버튼 */}
      {showSidebar ? (
        <Box sx={{ width: 280 }}>
          <ListDivider onClose={() => setShowSidebar(false)} />
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

      {/* 메인 콘텐츠: 시나리오 리스트 + 데이터 테이블 */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
        {/* 시나리오 목록 */}
        <Box sx={{ width: 260, borderRight: "1px solid #ccc" }}>
          <ScenarioList />
        </Box>

        {/* 테이블 영역 */}
        <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
          <DataGridSection />
        </Box>
      </Box>

    </Box>
  );
}

