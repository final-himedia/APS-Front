"use client";

import { Button, Menu, MenuItem, Box, Stack, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function ResultToolBar({ download, refresh }) {
  const [isCompact, setIsCompact] = useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  const actionButtons = [
    {
      label: "새로고침",
      icon: <RefreshIcon fontSize="small" />,
      onClick: refresh,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1120);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        p: 1,
        backgroundColor: "#f2e8e8",
        border: "1px solid #d0d7e2",
        borderRadius: 1,
        mb: 1,
        position: "relative",
      }}
    >
      {/* 왼쪽: 내보내기 */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <div>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileUploadIcon fontSize="small" />}
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
            sx={{
              px: 1.5,
              color: "#3f3f3f",
              borderColor: "#3f3f3f",
            }}
          >
            데이터 내보내기
          </Button>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                download();
                setExportMenuAnchor(null);
              }}
            >
              Excel 다운로드
            </MenuItem>
          </Menu>
        </div>
      </Stack>

      {/* 오른쪽: 새로고침 */}
      {isCompact ? (
        <>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            onClick={(e) => setMoreAnchorEl(e.currentTarget)}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={moreAnchorEl}
            open={Boolean(moreAnchorEl)}
            onClose={() => setMoreAnchorEl(null)}
          >
            {actionButtons.map((btn, idx) => (
              <MenuItem
                key={idx}
                onClick={() => {
                  btn.onClick();
                  setMoreAnchorEl(null);
                }}
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
              sx={{
                color: "#3f3f3f",
                borderColor: "#3f3f3f",
              }}
            >
              {btn.label}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
}
