"use client";

import React from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

export default function RightSidebar() {
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


  return (
    <Box
      sx={{
        width: 300,
        height: "100vh",
        p: 2,
        borderLeft: "1px solid #ccc",
        fontSize: "0.875rem",
        bgcolor: "white",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        결과 데이터 목록
      </Typography>

      <TextField
        placeholder="검색"
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
      />

      {/* 🎯 아코디언 하나로 단순하게 */}
      <Accordion disableGutters elevation={0} square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
          sx={{ backgroundColor: "#e3f2fd", minHeight: 36, px: 1.5 }}
        >
          <Typography
            sx={{ fontWeight: 500, fontSize: "0.85rem", color: "primary.main" }}
          >
            Input Data
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List dense disablePadding>
            {items.map((item, idx) => (
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
    </Box>
  );
}
