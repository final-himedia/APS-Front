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
        {filteredScenarios.map((id) => (
          <ListItemButton key={id} onClick={() => setSelectedScenarioId(id)}>
            <ListItemText primary={id} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
