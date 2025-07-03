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
import ScenarioAddDialog from "./ScenarioAddDialog";
import { Checkbox, ListItemIcon } from "@mui/material";

const scenarioIds = [
  { field: "scenarioId", headerName: "시나리오", width: 100 },
];

export default function ExeScenarioList({
  onClose,
  selectedScenarioIds,
  setSelectedScenarioIds,
}) {
  const [rows, setRows] = useState([]);
  const setSelectedScenarioId = useScenarioStore(
    (state) => state.setSelectedScenarioId
  );
  const selectedScenarioId = useScenarioStore(
    (state) => state.selectedScenarioId
  ); // 현재 선택된 시나리오 추적

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddScenario = ({ scenarioId, scenarioName }) => {
    const token = localStorage.getItem("token");

    fetch("15.164.98.31:8080/api/scenarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        scenarioId: scenarioId,
        name: scenarioName,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("추가 실패");
        return res.json();
      })
      .then(() => {
        alert("시나리오가 추가 되었습니다");
        setAddDialogOpen(false);
        fetchScenarioData(token);
      })
      .catch((err) => {
        console.err(err);
        alert("시나리오 추가 실패했습니다.");
      });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const fetchScenarioData = (token) => {
    const url = `15.164.98.31:8080/api/scenarios/list`;
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
            <Box sx={{ flexGrow: 1, maxWidth: "175px" }}>
              <SidebarSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </Box>
            <IconButton
              size="small"
              onClick={() => setAddDialogOpen(true)}
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
            disableRipple
            onClick={() => {
              const id = scenario.scenarioId;
              const isSelected = selectedScenarioIds.includes(id);
              setSelectedScenarioIds(isSelected ? [] : [id]);
            }}
            sx={{
              px: 1,
              py: 0.5,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f0e0e0",
              },
            }}
          >
            <Checkbox
              checked={selectedScenarioIds.includes(scenario.scenarioId)}
              onChange={(e) => {
                const checked = e.target.checked;
                const id = scenario.scenarioId;

                if (checked) {
                  setSelectedScenarioIds([id]);
                } else {
                  setSelectedScenarioIds([]);
                }
              }}
              sx={{
                color: "#aaa",
                "&.Mui-checked": { color: "#aaa" },
                padding: 0,
                mr: 1,
              }}
              onClick={(e) => e.stopPropagation()}
            />

            <ListItemText
              primary={scenario.scenarioId}
              sx={{ pl: 0, my: 0.2 }}
            />
          </ListItemButton>
        ))}
      </List>

      <ScenarioAddDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddScenario}
      />
    </Box>
  );
}
