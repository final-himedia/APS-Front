"use client";

import { useState } from "react";
import ScenarioList from "../standard/ScenarioList";
import DataGridSection from "../standard/DataGridSection";
import InputDataPanel from "../dashboard/InputDataPanel";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ScenarioPage() {
  const [showScenarioList, setShowScenarioList] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* 시나리오 목록 패널 */}
      {showScenarioList && (
        <ScenarioList
          listKey="scenario"
          onClose={() => setShowScenarioList(false)}
        />
      )}

      {/* 접혀있을 때만 나오는 열기 버튼 */}
      {!showScenarioList && (
        <IconButton
          onClick={() => setShowScenarioList(true)}
          size="small"
          sx={{
            position: "absolute",
            top: 0,
            left: "-20px",
            zIndex: 1000,
            bgcolor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: 1,
            m: 1,
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}

      {/* 테이블 */}
      <Box sx={{ flex: 1, p: 2 }}>
        <DataGridSection />
      </Box>

      {/* 입력 패널 */}
      <Box sx={{ width: 260, borderLeft: "1px solid #ccc" }}>
        <InputDataPanel />
      </Box>
    </Box>
  );
}
