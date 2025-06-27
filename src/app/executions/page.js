"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ExecutionsToolBar from "@/app/standard/ExecutionsToolBar";

import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@mui/material/IconButton";
import ExecutionLogModal from "./ExecutionLogModal";

export default function ExecutionsPage({
  selectedScenarioIds,
  setSelectedScenarioIds,
}) {
  const [rows, setRows] = useState([]);

  // ✅ 로그 모달용 상태
  const [logOpen, setLogOpen] = useState(false);
  const [logText, setLogText] = useState("");
  const [logTitle, setLogTitle] = useState("");

  // ✅ 로그 버튼 클릭 시 처리
  const handleLogClick = (row) => {
    const dummyLog = `🧪 시나리오 ID: ${row.scenarioId || "(없음)"}\n버전: ${
      row.version
    }\n에러 메시지: ${row.errorMessage || "없음"}`;
    setLogText(dummyLog);
    setLogTitle(`Experiment_${row.version} (${row.scenarioId || "?"})`);
    setLogOpen(true);
  };

  const columns = [
    { field: "version", headerName: "버전", width: 40 },
    { field: "status", headerName: "상태", width: 40 },
    { field: "duration", headerName: "소요시간", width: 80 },
    { field: "startTime", headerName: "시작 시간", width: 140 },
    { field: "endTime", headerName: "종료 시간", width: 140 },
    { field: "errorMessage", headerName: "에러 메시지", flex: 1 },
    { field: "schedule", headerName: "스케줄", flex: 1 },
    { field: "userId", headerName: "사용자ID", flex: 1 },
    {
      field: "result",
      headerName: "결과",
      width: 40,
      renderCell: (params) => (
        <IconButton
          title="결과 다운로드"
          size="small"
          onClick={() => alert(`결과 다운로드: ${params.row.id}`)}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
      ),
    },
    {
      field: "log",
      headerName: "로그",
      width: 40,
      renderCell: (params) => (
        <IconButton
          title="로그 보기"
          size="small"
          onClick={() => handleLogClick(params.row)}
        >
          <DescriptionIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    // 실행 결과 rows 불러오는 fetch 위치
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2, mb: 1 }}>
        <ExecutionsToolBar
          upload={() => {}}
          download={() => {}}
          selectedScenarioIds={selectedScenarioIds}
          setRows={setRows}
        />
      </Box>

      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" gutterBottom>
          실행 관리
        </Typography>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            rowHeight={38}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f2e8e8",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000",
                fontWeight: "bold",
              },
              border: 0,
              minWidth: "900px",
            }}
          />
        </Box>
      </Box>

      {/* 로그 모달 */}
      <ExecutionLogModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        logText={logText}
        title={logTitle}
      />
    </Box>
  );
}
