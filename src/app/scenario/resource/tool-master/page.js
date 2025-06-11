"use client";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "순번" },
  { field: "siteId", headerName: "플랜트" },
  { field: "toolId", headerName: "작업장 코드" },
  { field: "toolState", headerName: "호기명" },
  { field: "toolCavity", headerName: "호기그룹" },
  { field: "scenarioId", headerName: "호기유형" },
  { field: "toolName", headerName: "우선순위 그룹" },
];

export default function ToolMaster() {
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
          siteId: item.siteId,
          toolId: item.toolId,
          toolState: item.toolState,
          toolCavity: item.toolCavity,
          scenarioId: item.scenarioId,
          toolName: item.toolName,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        작업도구 마스터
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxSelection
        sx={{ border: 0 }}
        rowHeight={38}
      />
    </Box>
  );
}
