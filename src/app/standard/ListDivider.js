"use client";

import Link from "next/link";
import SidebarSearch from "./SidebarSearch";

import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  ListItemIcon,
} from "@mui/material";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import ScienceIcon from "@mui/icons-material/Science";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useState } from "react";

export default function ListDivider({ onClose }) {
  const [openFind, setOpenFind] = useState(false);
  const [openEngine, setOpenEngine] = useState(false);
  const [openResult, setOpenResult] = useState(false);

  return (
    <Box
      sx={{
        width: 240,
        boxSizing: "border-box",
        backgroundColor: "#fff",
        height: "100vh",
        overflowY: "auto",
        display: "flex",

        flexDirection: "column",
        px: 2,
      }}
    >
      {/* 로고 + 닫기 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 40,
          mt: "5px",
        }}
      >
        <img src="/logo/main-logo.png" alt="로고" style={{ height: 40 }} />
        <IconButton onClick={onClose} sx={{ mr: "-10px" }}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Box>

      <Divider sx={{ width: 220, my: 1 }} />

      <SidebarSearch />

      <Divider sx={{ width: 220, my: 1 }} />

      <List>
        {/* 즐겨찾기 */}
        <ListItemButton onClick={() => setOpenFind(!openFind)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <StarBorderIcon />
          </ListItemIcon>
          <ListItemText primary="즐겨찾기" />
          {openFind ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openFind} timeout="auto" unmountOnExit>
          <List>
            <ListItemButton>
              <ListItemText primary="수정해야함" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="수정해야함" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* 엔진 */}
        <ListItemButton onClick={() => setOpenEngine(!openEngine)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ScienceIcon />
          </ListItemIcon>
          <ListItemText primary="엔진" />
          {openEngine ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openEngine} timeout="auto" unmountOnExit>
          <List>
            <ListItemButton component={Link} href="/scenario">
              <ListItemText primary="시나리오 관리" />
            </ListItemButton>
            <ListItemButton component={Link} href="/run">
              <ListItemText primary="실행 관리" />
            </ListItemButton>
            <ListItemButton component={Link} href="/schedule">
              <ListItemText primary="스케줄 관리" />
            </ListItemButton>
            <ListItemButton component={Link} href="/result">
              <ListItemText primary="실행 결과" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* 결과 분석 */}
        <ListItemButton onClick={() => setOpenResult(!openResult)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <QueryStatsIcon />
          </ListItemIcon>
          <ListItemText primary="결과 분석" />
          {openResult ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openResult} timeout="auto" unmountOnExit>
          <List>
            <ListItemButton>
              <ListItemText primary="RTF 현황" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="대시보드" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="자원 운영 간트" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="생산 계획 간트" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="설비 가동 현황" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="시나리오 비교" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
}
