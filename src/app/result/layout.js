"use client";

import { useState } from "react";
import ScenarioList from "../standard/ScenarioList";
import RightSidebar from "../standard/RightSidebar";
import { IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ResultLayout({ children }) {
  const [showScenarioList, setShowScenarioList] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* 왼쪽 시나리오 목록 패널 */}
      {showScenarioList && (
        <div style={{ width: 260}}>
          <ScenarioList onClose={() => setShowScenarioList(false)} />
        </div>
      )}

      {/* 접혀 있을 때 보여주는 열기 버튼 */}
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
            backgroundColor: "#fff",
            boxShadow: 1,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}

      {/* 가운데 콘텐츠 */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>

      
     {/* 오른쪽 결과 데이터 패널 */}
        <RightSidebar />
    </div>
    
  );
}
