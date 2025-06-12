"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", width: 100 },
  { field: "operationId", headerName: "공정 코드", width: 130 },
  { field: "operationName", headerName: "공정 명", width: 180 },
  { field: "runTime", headerName: "공정 실행 시간", width: 100 },
  { field: "yield", headerName: "공정 수율", width: 100 },
  { field: "runTimeUom", headerName: "실행 시간 단위", width: 120 },
  { field: "operationType", headerName: "공정 유형", width: 130 },
  { field: "waitTimeUom", headerName: "대기시간 단위", width: 120 },
  { field: "transferTimeUom", headerName: "이동시간 단위", width: 120 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "sourcingType", headerName: "sourcingType", width: 120 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
  fetch("http://localhost:8080/api/scenarios/bop/operation")
    .then((res) => res.json())
    .then((data) => {
      const list = data.operations || [];

      const formatted = list.map((item, index) => ({
        id: index + 1,
        siteId: item.siteId,
        operationId: item.operationId,
        operationName: item.operationName,
        runTime: item.runTime,
        yield: item.yield,
        runTimeUom: item.runTimeUom,
        operationType: item.operationType,
        waitTimeUom: item.waitTimeUom,
        transferTimeUom: item.transferTimeUom,
        scenarioId: item.scenarioId,
        sourcingType: item.sourcingType,
      }));

      setRows(formatted);
    });
}, []);


  return (
    <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
      <Typography variant="h6" gutterBottom>
        공정 마스터
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
          minWidth: "500px",
        }}
        rowHeight={38}
      />
    </Box>
  );
}
