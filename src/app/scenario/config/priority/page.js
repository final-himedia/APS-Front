"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "priorityId", headerName: "우선순위 그룹", width: 150 },
  { field: "factorId", headerName: "우선순위", width: 180 },
  { field: "factorType", headerName: "FactorType", width: 130 },
  { field: "orderType", headerName: "주문유형", width: 100 },
  {
    field: "sequence",
    headerName: "우선순위 순서",
    width: 120,
    type: "number",
  },
  { field: "description", headerName: "설명", width: 250 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/config/priority")
      .then((res) => res.json())
      .then((data) => {
        const list = data.prioritys || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          scenarioId: item.priorityId?.scenarioId,
          priorityId: item.priorityId?.priorityId,
          factorId: item.priorityId?.factorId,
          factorType: item.factorType,
          orderType: item.orderType,
          sequence: item.sequence,
          description: item.description,
        }));
        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
      <Typography variant="h6" gutterBottom>
        우선순위
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
