"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", width: 100 },
  { field: "toolSize", headerName: "TOOL 사이즈", width: 100 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "partId", headerName: "품목 코드", width: 130 },
  { field: "toolId", headerName: "ToolId", width: 120 },
  { field: "partName", headerName: "품목명", width: 180 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/resource/tool-map")
      .then((res) => res.json())
      .then((data) => {
        const list = data.toolMasters || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId,
          scenarioId: item.scenarioId,
          toolId: item.toolId,
          toolSize: item.toolSize,
          partId: item.partId,
          partName: item.partName,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
      <Typography variant="h6" gutterBottom>
        작업장-도구 매핑관리
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        autoHeight
        sx={{
          border: 0,
          minWidth: "500px", // 너무 작게 줄어드는 걸 방지
        }}
        rowHeight={38}
      />
    </Box>
  );
}
