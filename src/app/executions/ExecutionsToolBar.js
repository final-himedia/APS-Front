"use client";

import { Button, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

export default function ResultToolBar({
  upload,
  download,
  selectedScenarioIds = [],
  setRows,
}) {
  const [isCompact, setIsCompact] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1500);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 실행
  const handleStart = async () => {
    if (isRunning || selectedScenarioIds.length === 0) return;
    setIsRunning(true);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다");
      setIsRunning(false);
      return;
    }

    for (const scenarioId of selectedScenarioIds) {
      try {
        const res = await fetch(
          `15.164.98.31:8080/api/analysis/get?scenarioId=${scenarioId}&userId=${userId}`
        );
        if (!res.ok) throw new Error("실행 실패");

        const result = await res.json();
        console.log("✅ 실행 성공:", result);

        setRows((prev) => [
          ...prev,
          {
            id: `${scenarioId}-${Date.now()}`,
            scenarioId,
            version: result.version ?? "v1.0",
            status: result.status ?? "성공",
            duration: `${result.durationMinutes ?? 0}초`,
            startTime: result.startTime?.replace("T", " ") ?? "-",
            endTime: result.endTime?.replace("T", " ") ?? "-",
            errorMessage: result.errorMessage ?? "",
            schedule: "수동",
            userId: result.userId ?? userId,
            result: "OK",
            log: "보기",
          },
        ]);
      } catch (err) {
        console.error("❌ 실행 실패:", err);
        alert("실행 중 오류 발생");
      }
    }

    setIsRunning(false);
  };

  // 삭제
  const handleDelete = async () => {
    if (selectedScenarioIds.length === 0) {
      alert("삭제할 시나리오를 선택해주세요.");
      return;
    }

    const confirmed = window.confirm(
      `선택된 시나리오 ${selectedScenarioIds.join(", ")} 의 실행 이력을 삭제할까요?`
    );
    if (!confirmed) return;

    try {
      for (const scenarioId of selectedScenarioIds) {
        const res = await fetch(
          `15.164.98.31:8080/api/analysis/delete/${scenarioId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("삭제 실패");

        const result = await res.json();
        console.log("🗑️ 삭제 결과:", result);

        // DataGrid에서 제거
        setRows((prev) =>
          prev.filter((row) => row.scenarioId !== scenarioId)
        );
      }

      alert("삭제 완료");
    } catch (err) {
      console.error("삭제 중 오류 발생:", err);
      alert("삭제 실패");
    }
  };

  // 버튼 목록
  const actionButtons = [
    {
      label: "시작",
      icon: <PlayArrowIcon fontSize="small" />,
      onClick: handleStart,
      disabled: selectedScenarioIds.length === 0 || isRunning,
    },
    {
      label: "정지",
      icon: <StopIcon fontSize="small" />,
      onClick: () => {
        alert("정지 기능은 아직 구현되지 않았습니다.");
      },
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
      onClick: handleDelete,
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
