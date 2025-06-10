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
import { useRouter } from "next/navigation";
import { useState } from "react";

const scenarioIds = [
  "S010000",
  "S020000",
  "S030000",
  "S040000",
  "S050000",
  "S060000",
];

export default function ScenarioList({ listKey, onClose }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // 검색어에 맞게 필터링
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

          {/* 검색창에 상태와 변경 함수 넘김 */}
          <SidebarSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <Divider sx={{ width: 220, my: 1 }} />
        </Box>
      </Box>

      {/* 필터링된 시나리오 목록 출력 */}
      <List dense>
        {filteredScenarios.map((id) => (
          <ListItemButton
            key={id}
            onClick={() => router.push(`/scenario/${id}`)}
            disablePadding
          >
            <ListItemText primary={id} sx={{ pl: 0 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
