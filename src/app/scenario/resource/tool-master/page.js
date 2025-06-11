"use client";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

// DataGrid 컬럼 정의
const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "toolId", headerName: "Tool ID", width: 150 },
  { field: "toolName", headerName: "Tool 이름", width: 150 },
  { field: "siteId", headerName: "플랜트", width: 120 },
  { field: "toolState", headerName: "사용 여부", width: 120 },
  { field: "toolCavity", headerName: "Cavity", width: 120 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function BopPage() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/resource/tool-master")
      .then((res) => res.json())
      .then((data) => {
        const list = data.toolMasters || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          toolId: item.toolId,
          siteId: item.siteId,
          toolState: item.toolState === "TRUE" ? "사용" : "미사용",
          toolCavity: item.toolCavity ?? "-",
          scenarioId: item.scenarioId || "-",
          toolName: item.toolName,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        작업도구 마스터 목록
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0, mt: 1 }}
        rowHeight={38}
      />
    </Box>
  );
}
