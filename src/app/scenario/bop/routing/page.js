"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "scenarioId", headerName: "시나리오", width: 150 },
  { field: "routingId", headerName: "라우팅 코드", width: 150 },
  { field: "siteId", headerName: "플랜트", width: 150 },
  { field: "routingName", headerName: "라우팅명", width: 150 },
  { field: "routingType", headerName: "라우팅 타입", width: 150 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/bop/routing")
      .then((res) => res.json())
      .then((data) => {
        const list = data.routings || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          scenarioId: item.scenarioId,
          routingId: item.routingId?.routingId || "",
          siteId: item.routingId?.siteId || "",
          routingName: item.routingName,
          routingType: item.routingType,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        생산 라우팅 목록
      </Typography>
      
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        rowHeight={38}
      />
    </Box>
  );
}
