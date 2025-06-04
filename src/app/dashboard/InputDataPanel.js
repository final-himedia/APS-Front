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

export default function InputDataPanel() {
  return (
    <Box
      sx={{ width: 300, height: "100vh", p: 2, borderLeft: "1px solid #ccc" }}
    >
      <Typography variant="h6" gutterBottom>
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
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          backgroundColor: "#f5f5f5", // 연한 회색 배경
          borderRadius: 1,
        }}
      />

      {/* Configurations 아코디언 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Configurations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItemButton>
              <ListItemText
                primary="엔진 실행 결과"
                primaryTypographyProps={{ color: "grey.500" }}
              />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Input Data 아코디언 (요구사항 반영) */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Input Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItemButton>
              <ListItemText
                primary="Bop"
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
            </ListItemButton>
            <ListItemButton>
              <ListItemText
                primary="생산프로세스"
                primaryTypographyProps={{ color: "grey.500" }}
              />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="공정 마스터" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="자재 마스터" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="BOM" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="플랜트 마스터" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="공정순서" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Config</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItemButton>
              <ListItemText
                primary="우선 순위"
                primaryTypographyProps={{ color: "grey.500" }}
              />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Resource 아코디언 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Resource</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItemButton>
              <ListItemText
                primary="작업도구 마스터"
                primaryTypographyProps={{ color: "grey.500" }}
              />
            </ListItemButton>
            <ListItemButton>
              <ListItemText
                primary="작업장 마스터"
                primaryTypographyProps={{ color: "grey.500" }}
              />
            </ListItemButton>
            <ListItemButton>
              <ListItemText
                primary="생산 라우팅"
                primaryTypographyProps={{ color: "grey.500" }}
              />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Target 아코디언 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Target</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItemButton>
              <ListItemText
                primary="판매오더"
                primaryTypographyProps={{ color: "grey.500" }}
              />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
