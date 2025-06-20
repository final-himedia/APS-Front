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
  const selectedScenarioId = useScenarioStore(
    (state) => state.selectedScenarioId
  ); // 현재 선택된 시나리오 추적

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
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "#f2e8e8",
        pl: 2,
        pr: 1,
        pt: 1,
      }}
    >
      {/* 상단: 제목 + 검색 + 접기 버튼 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 0,
          height: 100,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.7,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              시나리오 목록
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ mr: 1 }}>
              <ArrowForwardIosIcon
                fontSize="small"
                sx={{
                  transform: "rotate(180deg)",
                  transition: "transform 0.3s",
                }}
              />
            </IconButton>
          </Box>
          <Divider sx={{ width: 210, my: 1 }} />

          {/* 검색창 + FAB 버튼 */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
            <Box sx={{ flexGrow: 1, maxWidth: "175px"  }}>
              <SidebarSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </Box>
            <IconButton
              size="small"
              onClick={() => alert("Fab 눌림")}
              sx={{
                color: "#6f6a6a",
                mr: 0, 
                borderRadius: 1,
                width: 32,
                height: 32,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ width: 210, my: 1 }} />
        </Box>
      </Box>

      {/* 시나리오 리스트 */}
      <List dense>
        {filteredScenarios.map((scenario) => (
          <ListItemButton
            key={scenario.scenarioId}
            onClick={() => setSelectedScenarioId(scenario.scenarioId)}
            selected={selectedScenarioId === scenario.scenarioId}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#f5f5f5",
                borderRadius: "20px 0 0 20px",
                marginRight: "-12px",
                paddingRight: "24px",
                zIndex: 2,
                position: "relative",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ListItemText primary={scenario.scenarioId} sx={{ pl: 0 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
