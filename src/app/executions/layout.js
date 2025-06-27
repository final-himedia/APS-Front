"use client";

import { useState } from "react";
import { IconButton, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExeScenarioList from "../standard/ExeScenarioList";

import ExecutionsPage from "../executions/page";

export default function ExecutionLayout() {
  const [showScenarioList, setShowScenarioList] = useState(true);
  const [selectedScenarioIds, setSelectedScenarioIds] = useState([]);

  const SCENARIO_WIDTH = 240;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `
          ${showScenarioList ? `${SCENARIO_WIDTH}px` : "0px"}
          1fr
        `,
        width: "100%",
        maxWidth: "100vw",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 왼쪽 시나리오 패널 */}
      <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
        {showScenarioList && (
          <ExeScenarioList
            onClose={() => setShowScenarioList(false)}
            selectedScenarioIds={selectedScenarioIds}
            setSelectedScenarioIds={setSelectedScenarioIds}
          />
        )}
      </Box>

      {/* 중앙 콘텐츠 - children 대신 직접 실행 페이지 렌더링하는 방법 */}
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
        <ExecutionsPage
          selectedScenarioIds={selectedScenarioIds}
          setSelectedScenarioIds={setSelectedScenarioIds}
        />
      </Box>

      {/* 왼쪽 열기 버튼 */}
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
