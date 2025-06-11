"use client";

import { useState } from "react";
import ScenarioList from "../standard/ScenarioList";
import InputDataPanel from "../standard/InputDataPanel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { IconButton } from "@mui/material";
import Toolbar from "../standard/Toolbar"; // ✅ 툴바 import


export default function ScenarioLayout({ children }) {
  const [showScenarioList, setShowScenarioList] = useState(true);
  const [showInputPanel, setShowInputPanel] = useState(true);

  const SCENARIO_WIDTH = 260;
  const INPUT_WIDTH = 280;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `
      ${showScenarioList ? `${SCENARIO_WIDTH}px` : "0px"}
      1fr
      ${showInputPanel ? `${INPUT_WIDTH}px` : "0px"}
    `,
        width: "100%",
        maxWidth: "100vw",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 왼쪽 패널 (시나리오 목록) */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {showScenarioList && (
          <ScenarioList onClose={() => setShowScenarioList(false)} />
        )}
      </Box>

      {/* 가운데 콘텐츠 (children) */}
      <Box
        sx={{
          overflow: "auto", // 내용 스크롤
          minWidth: 0, // 수평 스크롤 방지
        }}
      >
        {children}
      </Box>

      {/* 오른쪽 패널 (입력 데이터 목록) */}
      <Box
        sx={{
          position: "relative",
          width: showInputPanel ? INPUT_WIDTH : "20px", // 닫힌 상태일 땐 최소 너비 확보
          height: "100%",
          right: 0,
          transition: "width 0.3s ease-in-out",
        }}
      >
        {showInputPanel ? (
          <InputDataPanel
            isOpen={true}
            onOpen={() => setShowInputPanel(true)}
            onClose={() => setShowInputPanel(false)}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 25,
              transform: "translateY(-50%)",
              zIndex: 1200,
            }}
          >
            <IconButton
              onClick={() => setShowInputPanel(true)}
              sx={{
                bgcolor: "white",
                border: "1px solid #ccc",
                borderRadius: 1,
                boxShadow: 1,
                width: 30,
                height: 30,
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* 왼쪽 패널 열기 버튼 */}
      {!showScenarioList && (
        <IconButton
          onClick={() => setShowScenarioList(true)}
          sx={{
            position: "absolute",
            left: 0,
            top: 10,
            zIndex: 1300,

            width: 30,
            height: 30,
            borderRadius: 1,

            backgroundColor: "#fff",
            borderRadius: 1,
            boxShadow: 1,
            width: 30,
            height: 30,
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}


      {/* 가운데 영역 */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Toolbar /> {/* ✅ 여기서 툴바 고정 */}
        {children} {/* ✅ 그 아래는 페이지 별 내용 */}
      </main>

      <InputDataPanel />
    </div>

  );
}
