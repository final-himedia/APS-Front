"use client";

import {
  Button,
  Menu,
  MenuItem,
  Box,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function Toolbar({ upload, download }) {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [importAnchorEl, setImportAnchorEl] = useState(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [isCompact, setIsCompact] = useState(false);

  const exportOpen = Boolean(exportAnchorEl);
  const importOpen = Boolean(importAnchorEl);
  const moreOpen = Boolean(moreAnchorEl);

  const handleExportClick = (e) => setExportAnchorEl(e.currentTarget);
  const handleExportClose = () => setExportAnchorEl(null);

  const handleImportClick = (e) => setImportAnchorEl(e.currentTarget);
  const handleImportClose = () => setImportAnchorEl(null);

  const handleMoreClick = (e) => setMoreAnchorEl(e.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  const actionButtons = [
    { label: "추가", icon: <AddIcon fontSize="small" />, onClick: onAdd },
    { label: "삭제", icon: <DeleteIcon fontSize="small" />, onClick: onDelete },
    {
      label: "저장",
      icon: <SaveIcon fontSize="small" />,
      onClick: onSave,
      disabled: false, // 필요하면 true로 변경
    },
    {
      label: "새로고침",
      icon: <RefreshIcon fontSize="small" />,
      onClick: onRefresh,
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1300);
    };

    handleResize(); // 초기 체크
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 1,
        p: 1,
        backgroundColor: "#f9f9f9",
        border: "1px solid #d0d7e2",
        borderRadius: 1,
        mb: 1,
        position: "relative",
      }}
    >
      {/* 왼쪽: 데이터 관련 */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <div>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileUploadIcon fontSize="small" />}
            onClick={handleExportClick}
            sx={{ px: 1.5 }}
          >
            데이터 내보내기
          </Button>
          <Menu
            anchorEl={exportAnchorEl}
            open={exportOpen}
            onClose={handleExportClose}
          >

            <MenuItem
              onClick={() => {
                download();
                setExportAnchorEl(null);
              }}
            >
              Excel 다운로드
            </MenuItem>

            <MenuItem onClick={handleExportClose}>CSV 다운로드</MenuItem>
          </Menu>
        </div>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FileDownloadIcon fontSize="small" />}
          onClick={handleImportClick}
          sx={{ px: 1.5 }}
        >
          데이터 가져오기
        </Button>
        <Menu
          anchorEl={importAnchorEl}
          open={importOpen}
          onClose={handleImportClose}
        >
          <MenuItem onClick={upload}>Excel 업로드</MenuItem>
          <MenuItem onClick={handleImportClose}>CSV 업로드</MenuItem>
        </Menu>
      </Stack>

      {/* 오른쪽: 버튼들 or ... 아이콘 */}
      {isCompact ? (
        <>
          <IconButton size="small" onClick={handleMoreClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={moreAnchorEl}
            open={moreOpen}
            onClose={handleMoreClose}
          >
            {actionButtons.map((btn, idx) => (
              <MenuItem
                key={idx}
                onClick={() => {
                  btn.onClick();
                  handleMoreClose();
                }}
                disabled={btn.disabled}
              >
                {btn.icon}
                <Box sx={{ ml: 1 }}>{btn.label}</Box>
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <Stack direction="row" spacing={1}>
          {actionButtons.map((btn, idx) => (
            <Button
              key={idx}
              size="small"
              variant="outlined"
              startIcon={btn.icon}
              onClick={btn.onClick}
              disabled={btn.disabled}
            >
              {btn.label}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
}
