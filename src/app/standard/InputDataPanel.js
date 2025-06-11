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

export default function InputDataPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const inputDataItems = [
    { label: "Bop", bold: true },
    { label: "생산 프로세스", indent: true, url: "/scenario/bop/routing" },
    { label: "공정 마스터", indent: true, url: "/scenario/bop/operation" },
    { label: "자재 마스터", indent: true, url: "/scenario/bop/part" },
    { label: "BOM", indent: true, url: "/scenario/bop/bom" },
    { label: "플랜트 마스터", indent: true, url: "/scenario/bop/site" },
    {
      label: "공정 순서",
      indent: true,
      url: "/scenario/bop/operation-routing",
    },
    { label: "Config", bold: true },
    { label: "우선순위", indent: true, url: "/scenario/priority" },
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

  function renderAccordion(title, items) {
    return (
      <Accordion disableGutters elevation={0} square defaultExpanded>
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
                onClick={() => {
                  if (item.label === "작업도구 마스터") {
                    router.push("/scenario/resource/mapping"); // ✅ 이 경로로 이동
                  }
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

  return (
    <>
      {/* 패널 본체 */}
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
          zIndex: 1200,
        }}
      >
        {/* 상단 제목 + 닫기 버튼 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
          >
            입력 데이터 목록
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

        {/* 검색 */}
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

        {/* 목록 */}
        <Accordion disableGutters elevation={0} square defaultExpanded>
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
      </Box>

      {/* 접힌 상태에서만 열기 버튼 표시 */}
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
    </>
  );
}
