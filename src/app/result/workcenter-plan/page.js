"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ResultToolBar from "@/app/standard/ResultToolBar";
import useScenarioStore from "@/hooks/useScenarioStore";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
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

export default function WorkcenterPlanView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const setScenarioId = useScenarioStore(
    (state) => state.setSelectedScenarioId
  );
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // 초기 시나리오 자동 설정
  useEffect(() => {
    if (!scenarioId) {
      setScenarioId("S000001");
    }
  }, [scenarioId, setScenarioId]);

  // 시나리오 ID 변경 시 데이터 fetch
  useEffect(() => {
    if (!scenarioId) return;

    fetch(`http://localhost:8080/api/result/workcenter-plan/${scenarioId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data?.plans || []).map((item, index) => ({
          id: index + 1,
          scenarioId: item.scenarioId ?? "-",
          no: item.no ?? "-",
          routingId: item.routingId ?? "-",
          workcenterId: item.workcenterId ?? "-",
          workcenterGroup: item.workcenterGroup ?? "-",
          workcenterName: item.workcenterName ?? "-",
          workcenterStartTime:
            item.workcenterStartTime?.replace("T", " ") ?? "-",
          workcenterEndTime: item.workcenterEndTime?.replace("T", " ") ?? "-",
          operationId: item.operationId ?? "-",
          operationName: item.operationName ?? "-",
          operationType: item.operationType ?? "-",
          toolId: item.toolId ?? "-",
          toolName: item.toolName ?? "-",
        }));

        setRows(formatted);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        console.error("데이터 불러오기 실패 ❌", err);
      });
  }, [scenarioId]);

  const handleDownload = () => {
    if (!scenarioId) return;
    fetch(
      `http://localhost:8080/api/result/workcenter-plan/download?scenarioId=${scenarioId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("다운로드 실패");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "workcenter-plan.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("다운로드 오류:", err);
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2, mb: 1 }}>
        <ResultToolBar upload={() => {}} download={handleDownload} />
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
          📌 작업장 별 생산 계획 (총 {total}건)
        </Typography>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50]}
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
              minWidth: "1200px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
