"use client";

import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Box,
  Divider,
  Fab,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SidebarSearch from "./SidebarSearch";
import { useState, useEffect } from "react";
import useScenarioStore from "@/hooks/useScenarioStore";
import AddIcon from "@mui/icons-material/Add";

const scenarioIds = [
  { field: "scenarioId", headerName: "시나리오", width: 100 },
];

export default function ScenarioList({ onClose }) {
  const [rows, setRows] = useState([]);
  const setSelectedScenarioId = useScenarioStore(
    (state) => state.setSelectedScenarioId
  );
  const [searchTerm, setSearchTerm] = useState("");

  const fetchScenarioData = (token) => {
    const url = `http://localhost:8080/api/scenarios/list`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = data.scenarios || [];
        const formatted = list.map((item, index) => ({
          scenarioId: item.scenarioId,
        }));
        setRows(formatted);
      })
      .catch((err) => console.error("scenarios 데이터 불러오기 실패:", err));
  };

  //컴포넌트 최초 마운트 시 기본 시나리오 설정
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchScenarioData(token);
    } else {
      console.log("토큰이 없습니다.");
    }
  }, []);

  const filteredScenarios = rows.filter((row) =>
    row.scenarioId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        borderRight: "1px solid #ccc",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6">시나리오 목록</Typography>
          <IconButton onClick={onClose} size="small">
            <ArrowForwardIosIcon
              fontSize="small"
              sx={{ transform: "rotate(180deg)" }}
            />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1 }}>
            <SidebarSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </Box>
          <IconButton
            size="small"
            color="info"
            onClick={() => alert("Fab 눌림")}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <List dense>
        {filteredScenarios.map((scenario) => (
          <ListItemButton
            key={scenario.scenarioId}
            onClick={() => setSelectedScenarioId(scenario.scenarioId)}
          >
            <ListItemText primary={scenario.scenarioId} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
