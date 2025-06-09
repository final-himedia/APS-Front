"use client";

import { useState } from "react";
import ScenarioList from "../standard/ScenarioList";
import DataGridSection from "../standard/DataGridSection";
import InputDataPanel from "../standard/InputDataPanel";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Grid } from "@mui/material";

export default function ScenarioPage() {
  const [showScenarioList, setShowScenarioList] = useState(true);

  return (
    <>
      <Grid container spacing={0}>
        <Grid size="auto">
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
        </Grid>
        <Grid size="grow">
          <DataGridSection />
        </Grid>
        <Grid size="auto">
          <InputDataPanel />
        </Grid>
      </Grid>
    </>
  );
}
