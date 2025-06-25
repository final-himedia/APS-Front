"use client";

import { Button, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

export default function ResultToolBar({
  upload,
  download,
  selectedScenarioIds = [],
}) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    console.log("🧪 툴바에서 받은 selectedScenarioIds:", selectedScenarioIds);

    const handleResize = () => {
      setIsCompact(window.innerWidth < 1500);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const actionButtons = [
    {
      label: "시작",
      icon: <PlayArrowIcon fontSize="small" />,
      onClick: () => {
        console.log("✅ 선택된 시나리오:", selectedScenarioIds);
      },
      disabled: selectedScenarioIds.length === 0,
    },
    {
      label: "정지",
      icon: <StopIcon fontSize="small" />,
      onClick: () => {},
      disabled: true,
    },
    {
      label: "새로고침",
      icon: <RefreshIcon fontSize="small" />,
      onClick: () => {
        window.location.reload();
      },
    },
    {
      label: "삭제",
      icon: <DeleteIcon fontSize="small" />,
      onClick: () => {
        alert("삭제 기능 미구현");
      },
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
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
      <Stack direction="row" spacing={1}>
        {actionButtons.map((btn, idx) => (
          <Button
            key={idx}
            size="small"
            variant="outlined"
            startIcon={btn.icon}
            onClick={btn.onClick}
            disabled={btn.disabled}
            sx={{
              color: "#3f3f3f",
              borderColor: "#3f3f3f",
            }}
          >
            {btn.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
