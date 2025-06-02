"use client";

import Box from "@mui/material/Box";
import * as React from "react";
import { useState } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import ListItemIcon from "@mui/material/ListItemIcon";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ScienceIcon from "@mui/icons-material/Science";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { TextField } from "@mui/material";

export default function ListDivider() {
  const [openFind, setopenFind] = useState(false);
  const [openEngine, setOpenEngine] = useState(false);
  const [openResult, setOpenResult] = useState(false);
 
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ width: 240, height: "100vh", p: 2 }}>
      <TextField defaultValue="검색">
          <SearchIcon />
        
      </TextField>

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
              <ListItemText primary="실행 결과" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="자원 운영 간트" />
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
