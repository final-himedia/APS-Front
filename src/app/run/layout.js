"use client";

import { useState } from "react";
import ScenarioList from "../standard/ScenarioList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";

export default function RunLayout({ children }) {
  const [showScenarioList, setShowScenarioList] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* 왼쪽 시나리오 목록 */}
      {showScenarioList && (
        <div style={{ width: 260}}>
          <ScenarioList onClose={() => setShowScenarioList(false)} />
        </div>
      )}

      {/* 시나리오 목록 열기 버튼 (접힌 상태일 때만) */}
      {!showScenarioList && (
        <IconButton
          onClick={() => setShowScenarioList(true)}
          sx={{
            position: "absolute",
            top: 10,
            left: "-7px",
            zIndex: 1300,
            width: 30,
            height: 30,
            borderRadius: 1,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}

      {/* 가운데 메인 콘텐츠 */}
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  );
}
