"use client";

import { useState, useEffect } from "react";
import DataGridSection from "../standard/DataGridSection";
import ScenarioList from "../standard/ScenarioList";
import Box from "@mui/material/Box";

export default function ScenarioPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [routingData, setRoutingData] = useState([]);

  useEffect(() => {
    if (!selectedScenarioId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/production-routing?scenarioId=${selectedScenarioId}`);
        const data = await res.json();
        setRoutingData(data);
      } catch (err) {
        console.error("데이터 가져오기 실패", err);
      }
    };

    fetchData();
  }, [selectedScenarioId]);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* 좌측 시나리오 리스트 */}
      <ScenarioList onScenarioSelect={setSelectedScenarioId} />
    </Box>
  );
}
