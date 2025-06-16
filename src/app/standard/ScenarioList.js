"use client";

import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SidebarSearch from "./SidebarSearch";
import { useState, useEffect } from "react";
import useScenarioStore from "@/hooks/useScenarioStore";

const scenarioIds = ["S010000", "S020000", "S030000"];

export default function ScenarioList({ onClose }) {
  const setSelectedScenarioId = useScenarioStore(
    (state) => state.setSelectedScenarioId
  );
  const [searchTerm, setSearchTerm] = useState("");

  //컴포넌트 최초 마운트 시 기본 시나리오 설정
  useEffect(() => {
    setSelectedScenarioId("S010000");
  }, [setSelectedScenarioId]);

  const filteredScenarios = scenarioIds.filter((id) =>
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: 240,
        borderRight: "1px solid #ccc",
        height: "100vh",
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden",
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
              pr: 2,
            }}
          >
            <Typography variant="h6">시나리오 목록</Typography>
            <IconButton onClick={onClose} size="small">
              <ArrowForwardIosIcon
                fontSize="small"
                sx={{
                  transform: "rotate(180deg)",
                  transition: "transform 0.3s",
                }}
              />
            </IconButton>
          </Box>

          <SidebarSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <Divider sx={{ width: 220, my: 1 }} />
        </Box>
      </Box>

      {/* 시나리오 목록 */}
      <List dense>
        {filteredScenarios.map((id) => (
          <ListItemButton
            key={id}
            onClick={() => setSelectedScenarioId(id)}
          >
            <ListItemText primary={id} sx={{ pl: 0 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
