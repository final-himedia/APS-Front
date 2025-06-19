"use client";

import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import ScenarioList from "../standard/ScenarioList";
import InputDataPanel from "../standard/InputDataPanel";

export default function ScenarioLayout({ children }) {
  const [showScenarioList, setShowScenarioList] = useState(true);
  const [showInputPanel, setShowInputPanel] = useState(true);

  const SCENARIO_WIDTH = 240;
  const INPUT_WIDTH = 260;

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
      {/* 왼쪽 패널 */}
      <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
        {showScenarioList && (
          <ScenarioList onClose={() => setShowScenarioList(false)} />
        )}
      </Box>

      {/* 가운데 콘텐츠 */}
      <Box
        sx={{
          overflow: "hidden",
          minWidth: 0,
          px: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* 실제 콘텐츠 */}
        <Box
          sx={{
            flex: 1,
            overflowX: "auto", //내부 가로 스크롤
            overflowY: "hidden",
            pb: 1,
          }}
        >
          {children}
        </Box>
      </Box>

      {/* 오른쪽 패널 */}
      <Box
        sx={{
          position: "relative",
          width: showInputPanel ? INPUT_WIDTH : "20px",
          height: "100%",
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
            left: 10,
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
