"use client";

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

import React, { useState } from "react";

export default function InputDataPanel({ isOpen, onOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const inputDataItems = [
    { label: "Bop", bold: true },
    { label: "생산 프로세스", indent: true, url: "/scenario/bop/routing" },
    { label: "공정 마스터", indent: true, url: "/scenario/bop/operation" },
    { label: "자재 마스터", indent: true, url: "/scenario/bop/part" },
    { label: "BOM", indent: true, url: "/scenario/bop/bom" },
    { label: "플랜트 마스터", indent: true, url: "/scenario/bop/site" },
    { label: "Config", bold: true },
    { label: "우선순위", indent: true, url: "/scenario/config/priority" },
    { label: "Resource", bold: true },
    {
      label: "작업도구 마스터",
      indent: true,
      url: "/scenario/resource/tool-master",
    },
    {
      label: "작업장 마스터",
      indent: true,
      url: "/scenario/resource/workcenter",
    },
    {
      label: "생산 라우팅",
      indent: true,
      url: "/scenario/resource/workcenter-map",
    },
    {
      label: "작업장-도구 매핑관리",
      indent: true,
      url: "/scenario/resource/tool-map",
    },
    { label: "Target", bold: true },
    { label: "판매오더", indent: true, url: "/scenario/target/demand" },
  ];

  const filteredItems = inputDataItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        flexDirection: "column",
        bgcolor: "white",
        borderLeft: "1px solid #ccc",
      }}
    >
      {isOpen ? (
        <>
          {/* 상단 제목 + 닫기 버튼 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 2, pt: 2 }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              입력 데이터 목록
            </Typography>
            <IconButton onClick={onClose} size="small">
              <ChevronRightIcon />
            </IconButton>
          </Stack>

          {/* 검색 */}
          <Box sx={{ px: 2, pb: 1 }}>
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
              sx={{
                mb: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            />
          </Box>

          {/* 목록.*/}
          <Accordion
            disableGutters
            elevation={0}
            square
            defaultExpanded
            sx={{ px: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
              sx={{ backgroundColor: "#f2e8e8", minHeight: "36px", px: 1.5 }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  color: "black",
                }}
              >
                Input Data
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
        </>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: 0,
            zIndex: 1200,
          }}
        >
          <IconButton
            onClick={onOpen}
            sx={{
              bgcolor: "white",
              border: "1px solid #ccc",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
