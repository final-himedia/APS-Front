"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ResultToolBar from "@/app/standard/ResultToolBar";

const columns = [
  { field: "no", headerName: "순번", width: 80 },
  { field: "workcenterId", headerName: "작업장 ID", width: 120 },
  { field: "workcenterName", headerName: "작업장 명", width: 150 },
  { field: "operationId", headerName: "공정 ID", width: 130 },
  { field: "operationName", headerName: "공정명", width: 150 },
  { field: "operationType", headerName: "공정 타입", width: 130 },
  { field: "workcenterStartTime", headerName: "시작 시간", width: 180 },
  { field: "workcenterEndTime", headerName: "종료 시간", width: 180 },
  { field: "workcenterGroup", headerName: "작업장 그룹", width: 130 },
  { field: "toolId", headerName: "설비 ID", width: 100 },
  { field: "toolName", headerName: "설비명", width: 100 },
  { field: "routingId", headerName: "라우팅 ID", width: 130 },
];

export default function OperationQuantityPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const scenarioId = "S000001";
    fetch(`http://127.0.0.1:8080/api/result/workcenter-plan/${scenarioId}`)
      .then((res) => res.json())
      .then((data) => {
        const plans = data.plans || [];
        const formatted = plans.map((plan) => ({
          id: plan.no, // DataGrid에서 고유 row 키
          ...plan,
          workcenterStartTime:
            plan.workcenterStartTime?.replace("T", " ") ?? "-",
          workcenterEndTime: plan.workcenterEndTime?.replace("T", " ") ?? "-",
        }));
        setRows(formatted);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        console.error("데이터 불러오기 실패", err);
      });
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 영역 */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <ResultToolBar upload={() => {}} download={() => {}} />
      </Box>

      {/* 메인 카드 */}
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
          📌 공정 별 생산 수량 조회 (총 {total}건)
        </Typography>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            autoHeight={false}
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
              minWidth: "1200px", // 칼럼 수 많아져서 넓힘
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
