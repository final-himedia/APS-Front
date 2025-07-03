"use client";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ResultToolBar from "@/app/standard/ResultToolBar";
import useScenarioStore from "@/hooks/useScenarioStore";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "workcenterId", headerName: "작업장 ID", flex: 1 },
  { field: "workcenterName", headerName: "작업장 이름", flex: 1 },
  { field: "workcenterGroup", headerName: "작업장 그룹", flex: 1 },
  { field: "priorityId", headerName: "우선순위", flex: 1 },
  { field: "workcenterState", headerName: "상태", width: 80 },
  { field: "automation", headerName: "자동화", width: 100 },
];

export default function LoadStatPage() {
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

  const handleDownload = () => {
    if (!scenarioId) return;
    const url = `15.164.98.31:8080/api/analysis/workcenter-download?scenarioId=${scenarioId}`;
    window.open(url, "_blank");
  };

  const fetchData = () => {
    if (!scenarioId) return;

    fetch(
      `15.164.98.31:8080/api/execution/workcenter?scenarioId=${scenarioId}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data || []).map((item, idx) => ({
          id: idx + 1,
          workcenterId: item.workCenterId?.workcenterId ?? "-",
          workcenterName: item.workcenterName ?? "-",
          workcenterGroup: item.workcenterGroup ?? "-",
          priorityId: item.priorityId ?? "-",
          workcenterState: item.workcenterState ?? "-",
          automation: item.automation ?? "-",
        }));
        setRows(formatted);
        setTotal(formatted.length);
      })
      .catch((err) => {
        console.error("작업장 목록 불러오기 실패:", err);
      });
  };

  useEffect(() => {
    if (!scenarioId) setScenarioId("S000001");
  }, [scenarioId]);

  useEffect(() => {
    fetchData();
  }, [scenarioId]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2, mb: 1 }}>
        <ResultToolBar upload={undefined} download={handleDownload} />
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
          📌 작업장 가동 현황 (총 {total}건)
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
              minWidth: "700px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
