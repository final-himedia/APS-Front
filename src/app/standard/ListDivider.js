"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  ListItemIcon,
  TextField,
  InputAdornment,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ScienceIcon from "@mui/icons-material/Science";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";

export default function ListDivider({ onClose }) {
  const [openFind, setOpenFind] = useState(false);
  const [openEngine, setOpenEngine] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const matchesSearch = (label) =>
    label.toLowerCase().includes(searchTerm.toLowerCase());

  const renderMenuItem = (label, href) => {
    if (searchTerm && !matchesSearch(label)) return null;

    return (
      <ListItemButton
        component={Link}
        href={href}
        key={label}
        sx={{
          pl: 4,
          py: 0.5,
        }}
      >
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: "0.95rem",
            fontWeight: 400,
            color: "grey.800",
          }}
        />
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(label, href);
          }}
          sx={{ opacity: 0.4, "&:hover": { opacity: 1 } }}
        >
          <StarIcon fontSize="small" />
        </IconButton>
      </ListItemButton>
    );
  };

  const engineMenuItems = [
    { label: "시나리오 관리", href: "/scenario" },
    { label: "실행 관리", href: "/run" },
    { label: "스케줄 관리", href: "/schedule" },
    { label: "실행 결과", href: "/result/workcenter-plan" },
  ];

  const resultMenuItems = [
    { label: "RTF 현황", href: "#" },
    { label: "대시보드", href: "#" },
    { label: "자원 운영 간트", href: "#" },
    { label: "생산 계획 간트", href: "#" },
    { label: "설비 가동 현황", href: "#" },
    { label: "시나리오 비교", href: "#" },
  ];

  const manageMenuItems = [
    { label: "사용자 관리", href: "/management/user-management" },
    { label: "문의 게시판", href: "/management/qna" },
  ];

  const hasMatches = (items) => items.some((item) => matchesSearch(item.label));

  return (
    <Box
      sx={{
        width: 240,
        maxWidth: 240,
        overflowX: "hidden",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        px: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 40,
          mt: "5px",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo/main-logo.png"
            alt="로고"
            style={{ height: 40, cursor: "pointer" }}
          />
        </Link>
        <IconButton onClick={onClose} sx={{ mr: "-10px" }}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Box>

      <Divider sx={{ width: "100%", my: 1 }} />
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
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{
          height: 32,
          width: 220,
          "& .MuiInputBase-root": { height: 32 },
        }}
      />
      <Divider sx={{ width: "100%", my: 1 }} />

      <List>
        {favorites.length > 0 && (
          <>
            <ListItemButton onClick={() => setOpenFind(!openFind)}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="즐겨찾기" />
              {(searchTerm ? hasMatches(favorites) : openFind) ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
            <Collapse
              in={searchTerm ? hasMatches(favorites) : openFind}
              timeout="auto"
              unmountOnExit
            >
              <List>
                {favorites
                  .filter((item) => !searchTerm || matchesSearch(item.label))
                  .map((item) => renderMenuItem(item.label, item.href))}
              </List>
            </Collapse>
          </>
        )}

        <ListItemButton onClick={() => setOpenEngine(!openEngine)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ScienceIcon />
          </ListItemIcon>
          <ListItemText primary="엔진" />
          {(searchTerm ? hasMatches(engineMenuItems) : openEngine) ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>
        <Collapse
          in={searchTerm ? hasMatches(engineMenuItems) : openEngine}
          timeout="auto"
          unmountOnExit
        >
          <List>
            {engineMenuItems.map(({ label, href }) =>
              renderMenuItem(label, href)
            )}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setOpenResult(!openResult)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <QueryStatsIcon />
          </ListItemIcon>
          <ListItemText primary="결과 분석" />
          {(searchTerm ? hasMatches(resultMenuItems) : openResult) ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>
        <Collapse
          in={searchTerm ? hasMatches(resultMenuItems) : openResult}
          timeout="auto"
          unmountOnExit
        >
          <List>
            {resultMenuItems.map(({ label, href }) =>
              renderMenuItem(label, href)
            )}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setOpenManage(!openManage)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="관리" />
          {(searchTerm ? hasMatches(manageMenuItems) : openManage) ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItemButton>
        <Collapse
          in={searchTerm ? hasMatches(manageMenuItems) : openManage}
          timeout="auto"
          unmountOnExit
        >
          <List>
            {manageMenuItems.map(({ label, href }) =>
              renderMenuItem(label, href)
            )}
          </List>
        </Collapse>
      </List>
    </Box>
  );
}
