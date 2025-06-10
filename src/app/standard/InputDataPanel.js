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

export default function InputDataPanel() {
  const router = useRouter();

 const items = [
  { label: "Bop", bold: true },
  { label: "생산 프로세스", indent: true, url: "/scenario/bop" },
  { label: "공정 마스터", indent: true, url: "/scenario/bop/operation" },
  { label: "자재 마스터", indent: true, url: "/scenario/bop/material" },
  { label: "BOM", indent: true, url: "/scenario/bop/bom" },
  { label: "플랜트 마스터", indent: true, url: "/scenario/bop/plant" },
  { label: "공정 순서", indent: true, url: "/scenario/bop/sequence" },

  { label: "Config", bold: true },
  { label: "우선순위", indent: true, url: "/scenario/config" },

  { label: "Resource", bold: true },
  { label: "작업도구 마스터", indent: true, url: "/scenario/resource/tool" },
  { label: "작업장 마스터", indent: true, url: "/scenario/resource/workcenter" },
  { label: "생산 라우팅", indent: true, url: "/scenario/resource/routing" },
  { label: "작업장-도구 매핑관리", indent: true, url: "/scenario/resource/mapping" },

  { label: "Target", bold: true },
  { label: "판매오더", indent: true, url: "/scenario/target" },
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
        sx={{ mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
      />

      {/* 🎯 아코디언 하나로 단순하게 */}
      <Accordion disableGutters elevation={0} square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
          sx={{ backgroundColor: "#e3f2fd", minHeight: 36, px: 1.5 }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.85rem", color: "primary.main" }}>
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
