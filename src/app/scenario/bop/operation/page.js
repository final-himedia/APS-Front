"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import ExecutionsToolBar from "@/app/executions/ExecutionsToolBar"; // ✅ 수정됨
import useScenarioStore from "@/hooks/useScenarioStore";

const columns = [
  { field: "id", headerName: "버전", width: 80 },
  { field: "status", headerName: "상태", width: 80 },
  { field: "durationMinutes", headerName: "소요시간", width: 100 },
  { field: "startTime", headerName: "시작 시간", flex: 1 },
  { field: "endTime", headerName: "종료 시간", flex: 1 },
  { field: "errorMessage", headerName: "에러 메시지", flex: 1 },
  { field: "scenarioId", headerName: "스케줄", width: 100 },
  { field: "userId", headerName: "사용자ID", width: 100 },
  { field: "result", headerName: "결과", width: 80, renderCell: () => "-" },
  { field: "log", headerName: "로그", width: 80, renderCell: () => "-" },
];

export default function ExecutionManageView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const [rows, setRows] = useState([]);
  const [token, setToken] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!scenarioId || !token) return;
    fetch(`http://localhost:8080/api/analysis/get/${scenarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data || []).map((item, idx) => ({
          id: item.version ?? idx + 1,
          status: item.status,
          durationMinutes: item.durationMinutes,
          startTime: item.startTime?.replace("T", " ") ?? "",
          endTime: item.endTime?.replace("T", " ") ?? "",
          errorMessage: item.errorMessage ?? "",
          scenarioId: item.scenarioId,
          userId: item.userId,
        }));
        setRows(formatted);
      })
      .catch((err) => console.error("실행관리 조회 실패", err));
  }, [scenarioId, token]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2 }}>
        <ExecutionsToolBar /> {/* ✅ 수정됨 */}
      </Box>

      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          p: 2,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          실행 관리
        </Typography>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            checkboxSelection
            autoHeight={false}
            rowHeight={38}
            sx={{
              border: 0,
              minWidth: "1000px",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f2e8e8",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
