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

function renderAccordion(title, items) {
  return (
    <Accordion disableGutters elevation={0} square>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
        sx={{
          backgroundColor: "#e3f2fd",
          minHeight: "36px",
          px: 1.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.85rem",
            color: "primary.main",
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List dense disablePadding>
          {items.map((item, idx) => (
            <ListItemButton
              key={idx}
              sx={{
                pl: item.indent ? 4 : 2,
                py: 0.5,
              }}
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
  );
}

export default function InputDataPanel() {
  const inputDataItems = [
    { label: "Bop", bold: true },
    { label: "생산 프로세스", indent: true },
    { label: "공정 마스터", indent: true },
    { label: "자재 마스터", indent: true },
    { label: "BOM", indent: true },
    { label: "플랜트 마스터", indent: true },
    { label: "공정 순서", indent: true },

    { label: "Config", bold: true },
    { label: "우선순위", indent: true },

    { label: "Resource", bold: true },
    { label: "작업도구 마스터", indent: true },
    { label: "작업장 마스터", indent: true },
    { label: "생산 라우팅", indent: true },
    { label: "작업장-도구 매핑관리", indent: true },

    { label: "Target", bold: true },
    { label: "판매오더", indent: true },
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
        입력 데이터 목록
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
        sx={{
          mb: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
        }}
      />

      {/* ✅ 통합된 Input Data 아코디언 */}
      {renderAccordion("Input Data", inputDataItems)}

      {/* 별도 아코디언이었던 Config, Resource, Target은 제거 */}
    </Box>
  );
}
