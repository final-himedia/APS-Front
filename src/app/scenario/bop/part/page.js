"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", width: 100 },
  { field: "partId", headerName: "품목 코드", width: 130 },
  { field: "partType", headerName: "Part 유형", width: 180 },
  { field: "routingId", headerName: "Routing 코드", width: 100 },
  { field: "partName", headerName: "품목명", width: 100 },
  { field: "minBatchSize", headerName: "생산 배치 사이즈(최소)", width: 120 },
  { field: "maxBatchSize", headerName: "생산 배치 사이즈(최대)", width: 130 },
  { field: "uom", headerName: "단위", width: 120 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/bop/part")
      .then((res) => res.json())
      .then((data) => {
        const list = data.parts || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.partId?.siteId,
          partId: item.partId?.partId,
          partType: item.partId?.partType,
          routingId: item.routingId,
          partName: item.partName,
          minBatchSize: item.minBatchSize,
          maxBatchSize: item.maxBatchSize,
          uom: item.uom,
          scenarioId: item.scenarioId,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
      <Typography variant="h6" gutterBottom>
        자재 마스터
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        autoHeight
        sx={{ border: 0, minWidth: "500px" }}
        rowHeight={38}
      />
    </Box>
  );
}
