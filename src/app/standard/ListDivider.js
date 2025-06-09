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

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ScienceIcon from "@mui/icons-material/Science";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useEffect, useState } from "react";

export default function ListDivider({ onClose }) {
  const [openFind, setOpenFind] = useState(false);
  const [openEngine, setOpenEngine] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("즐겨찾기 파싱 오류:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (label, href) => {
    const exists = favorites.find((item) => item.label === label);
    if (exists) {
      setFavorites((prev) => prev.filter((item) => item.label !== label));
    } else {
      setFavorites((prev) => [...prev, { label, href }]);
    }
  };

  const renderMenuItem = (label, href) => (
    <ListItemButton component={Link} href={href} key={label}>
      <ListItemText primary={label} />
      <IconButton
        size="small"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(label, href);
        }}
        sx={{
          opacity: 0.4,
          "&:hover": { opacity: 1 },
        }}
      >
        <StarIcon fontSize="small" />
      </IconButton>
    </ListItemButton>
  );

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
        {favorites.length > 0 && (
          <>
            <ListItemButton onClick={() => setOpenFind(!openFind)}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="즐겨찾기" />
              {openFind ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openFind} timeout="auto" unmountOnExit>
              <List>
                {favorites.map((item) => (
                  <ListItemButton
                    key={item.label}
                    component={Link}
                    href={item.href}
                  >
                    <ListItemText primary={item.label} />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(item.label, item.href);
                      }}
                    >
                      <StarIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}

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
            {renderMenuItem("시나리오 관리", "/scenario")}
            {renderMenuItem("실행 관리", "/run")}
            {renderMenuItem("스케줄 관리", "/schedule")}
            {renderMenuItem("실행 결과", "/result")}
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
            {renderMenuItem("RTF 현황", "#")}
            {renderMenuItem("대시보드", "#")}
            {renderMenuItem("자원 운영 간트", "#")}
            {renderMenuItem("생산 계획 간트", "#")}
            {renderMenuItem("설비 가동 현황", "#")}
            {renderMenuItem("시나리오 비교", "#")}
          </List>
        </Collapse>
      </List>
    </Box>
  );
}
