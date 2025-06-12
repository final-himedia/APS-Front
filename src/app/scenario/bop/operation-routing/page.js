"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", width: 120 },
  { field: "routingId", headerName: "ROUTING 코드", width: 130 },
  { field: "operationId", headerName: "공정 코드", width: 150 },
  { field: "operationName", headerName: "공정명", width: 180 },
  { field: "operationSeq", headerName: "공정 순서", width: 120 },
  { field: "operationType", headerName: "공정 유형", width: 130 },
  { field: "createDatetime", headerName: "생성일자", width: 180 },
  { field: "updateDatetime", headerName: "수정일자", width: 180 },
  { field: "scenarioId", headerName: "시나리오", width: 130 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/bop/operationRouting")
      .then((res) => res.json())
      .then((data) => {
        const list = data.operationRoutings || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.operationRoutingId?.siteId ?? "",
          routingId: item.operationRoutingId?.routingId ?? "",
          operationId: item.operationRoutingId?.operationId ?? "",
          operationSeq: item.operationRoutingId?.operationSeq ?? "",
          operationName: item.operationName,
          operationType: item.operationType,
          scenarioId: item.scenarioId,
          createDatetime: item.createDatetime,
          updateDatetime: item.updateDatetime,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
      <Typography variant="h6" gutterBottom>
        공정 순서
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
