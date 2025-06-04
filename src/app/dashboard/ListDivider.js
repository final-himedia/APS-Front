"use client"; // 이 줄이 최상단에 와야 함!

import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ScienceIcon from "@mui/icons-material/Science";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { TextField } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export default function ListDivider() {
  const [openFind, setopenFind] = useState(false);
  const [openEngine, setOpenEngine] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  return (
    <Box sx={{ width: 240, height: "100vh", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/logo/main-logo.png" alt="로고" style={{ height: 40 }} />
        <IconButton>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />
      <TextField
        placeholder="검색"
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Divider sx={{ my: 1 }} />

      <List>
        <ListItemButton onClick={() => setopenFind(!openFind)}>
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

        <ListItemButton onClick={() => setOpenEngine(!openEngine)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ScienceIcon />
          </ListItemIcon>
          <ListItemText primary="엔진" />
          {openEngine ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openEngine} timeout="auto" unmountOnExit>
          <List>
            <ListItemButton>
              <ListItemText primary="시나리오 관리" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="스케줄 관리" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="실행 결과" />
            </ListItemButton>
          </List>
        </Collapse>

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
