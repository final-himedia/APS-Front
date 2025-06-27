"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ResultToolBar from "@/app/standard/ResultToolBar";
import useScenarioStore from "@/hooks/useScenarioStore";

const columns = [
  { field: "id", headerName: "순번", width: 40 },
  { field: "scenarioId", headerName: "시나리오", width: 80 },
  { field: "no", headerName: "고유번호", width: 80 },
  { field: "routingId", headerName: "routing", flex: 1 },
  { field: "workcenterId", headerName: "작업장 ID", width: 80 },
  { field: "workcenterGroup", headerName: "작업장 그룹", flex: 1 },
  { field: "workcenterName", headerName: "작업장 이름", flex: 1 },
  { field: "workcenterStartTime", headerName: "시작 시간", width: 80 },
  { field: "workcenterEndTime", headerName: "종료 시간", width: 80 },
  { field: "operationId", headerName: "공정 ID", width: 70 },
  { field: "operationName", headerName: "공정명", width: 70 },
  { field: "operationType", headerName: "공정 유형", width: 80 },
  { field: "toolId", headerName: "도구 ID", width: 70 },
  { field: "toolName", headerName: "작업자", width: 80 },
];

export default function WorkcenterPlanView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const setScenarioId = useScenarioStore(
    (state) => state.setSelectedScenarioId
  );
  const [rows, setRows] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // 초기 시나리오 자동 설정 (한번만 실행)
  useEffect(() => {
    if (!scenarioId) {
      setScenarioId("S000001");
    }
  }, [scenarioId, setScenarioId]);

  // 시나리오 ID 변경 시 fetch 실행
  useEffect(() => {
    if (!scenarioId) return;
    fetch(`http://localhost:8080/api/result/workcenter-plan/${scenarioId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("받은 데이터:", data);
        const formatted = (data?.plans || []).map((item, index) => ({
          id: index + 1,
          scenarioId: item.scenarioId ?? "-",
          no: item.no ?? "-",
          routingId: item.routingId ?? "-",
          workcenterId: item.workcenterId ?? "-",
          workcenterGroup: item.workcenterGroup ?? "-",
          workcenterName: item.workcenterName ?? "-",
          workcenterStartTime: item.workcenterStartTime ?? "-",
          workcenterEndTime: item.workcenterEndTime ?? "-",
          operationId: item.operationId ?? "-",
          operationName: item.operationName ?? "-",
          operationType: item.operationType ?? "-",
          toolId: item.toolId ?? "-",
          toolName: item.toolName ?? "-",
        }));

        setRows(formatted);
      })
      .catch((err) => {
        console.error("데이터 가져오기 실패:", err);
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
          작업장 별 생산계획
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
              minWidth: "1100px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
