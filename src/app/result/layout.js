"use client";

import { useState } from "react";
import ScenarioList from "../standard/ScenarioList";
import ResultDataPanel from "../standard/ResultDataPanel";
import { IconButton, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function ResultLayout({ children }) {
  const [showScenarioList, setShowScenarioList] = useState(true);
  const [showResultPanel, setShowResultPanel] = useState(true);

  const SCENARIO_WIDTH = 260;
  const RESULT_WIDTH = 280;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `
          ${showScenarioList ? `${SCENARIO_WIDTH}px` : "0px"}
          1fr
          ${showResultPanel ? `${RESULT_WIDTH}px` : "0px"}
        `,
        width: "100%",
        maxWidth: "100vw",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 왼쪽 시나리오 목록 패널 */}
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

      {/* 가운데 콘텐츠 */}
      <Box
        component="main"
        sx={{
          overflow: "auto",
          minWidth: 0,
        }}
      >
        {children}
      </Box>

      {/* 오른쪽 결과 데이터 패널 */}
      <Box
        sx={{
          position: "relative",
          width: showResultPanel ? RESULT_WIDTH : "20px",
          height: "100%",
          right: 0,
          transition: "width 0.3s ease-in-out",
        }}
      >
        {showResultPanel ? (
          <ResultDataPanel
            isOpen={true}
            onOpen={() => setShowResultPanel(true)}
            onClose={() => setShowResultPanel(false)}
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
              onClick={() => setShowResultPanel(true)}
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

      {/* 왼쪽 열기 버튼 (시나리오 목록) */}
      {!showScenarioList && (
        <IconButton
          onClick={() => setShowScenarioList(true)}
          sx={{
            position: "absolute",
            left: 0,
            top: 10,
            zIndex: 1300,
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
    </Box>
  );
}
