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

export default function ResultDataPanel({ isOpen, onOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const items = [

    { label: "Simulation", bold: true },
    {
      label: "작업장별 생산 계획",
      indent: true,
      url: "/result/workcenter-plan",
    },
    { label: "작업장 가동 현황", indent: true, url: "/result/load-stat" },
  ];

  const filteredItems = items.filter((item) =>
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
              결과 데이터 목록
            </Typography>
            <IconButton onClick={onClose} size="small">
              <ChevronRightIcon />
            </IconButton>
          </Stack>

          {/* 검색창 */}
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

          {/* 아코디언 목록 */}
          <Accordion
            disableGutters
            elevation={0}
            square
            defaultExpanded
            sx={{ px: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "black" }} />}
              sx={{ backgroundColor: "#f2e8e8", minHeight: "36px", px: 1.5 }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  color: "black",
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
