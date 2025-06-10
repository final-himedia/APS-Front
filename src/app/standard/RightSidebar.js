"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";

export default function ResultDataPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const items = [
    { label: "Simulation", bold: true },
    { label: "작업도구 사용 내역", indent: true, url: "/result/simulation" },
    { label: "제공품 미사용 내역", indent: true, url: "/result/simulation/unused-supplies" },
    { label: "용액 일지 조회", indent: true, url: "/result/simulation/solution-log" },
    { label: "계획오더 전송 로그", indent: true, url: "/result/simulation/order-log" },
    { label: "공정 별 생산 수량 조회", indent: true, url: "/result/simulation/operation-quantity" },
    { label: "LOT 병합 이력", indent: true, url: "/result/simulation/lot-merge-history" },
    { label: "계획오더 조회", indent: true, url: "/result/simulation/order-list" },
    { label: "작업장별 생산 계획", indent: true, url: "/result/simulation/workcenter-plan" },
    { label: "아직 추가 다 안함.", indent: true, url: "/result/simulation/todo" },
    { label: "TaskAct", bold: true },
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        position: "fixed",
        right: isOpen ? 0 : -300,
        top: 40,
        width: 300,
        height: "100vh",
        p: 2,
        borderLeft: "1px solid #ccc",
        fontSize: "0.875rem",
        bgcolor: "white",
        transition: "right 0.3s ease-in-out",
      
      }}
    >
      {/* 상단 제목 + 토글 */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
        >
          결과 데이터 목록
        </Typography>
        <IconButton
          size="small"
          onClick={() => setIsOpen(false)}
          sx={{
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#f0f0f0" },
            ml: 1,
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      {/* 검색창 */}
      <TextField
        placeholder="검색"
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
      />

      {/* Accordion */}
      <Accordion disableGutters elevation={0} square defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
          sx={{ backgroundColor: "#e3f2fd", minHeight: "36px", px: 1.5 }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "0.85rem",
              color: "primary.main",
            }}
          >
            Result Data
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List dense disablePadding>
            {filteredItems.map((item, idx) => (
              <ListItemButton
                key={idx}
                sx={{ pl: item.indent ? 4 : 2, py: 0.5 }}
                onClick={() => item.url && router.push(item.url)}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: item.bold ? "0.875rem" : "0.8125rem",
                    fontWeight: item.bold ? 600 : 400,
                    color: item.bold ? "grey.800" : "grey.500",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 접힌 상태일 때만 버튼 보임 */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            top: 50,
            right: 0,
            zIndex: 1300,
            bgcolor: "white",
            border: "1px solid #ccc",
            borderRadius: "50%",
            width: 32,
            height: 32,
            boxShadow: 1,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
    </Box>
  );
}
