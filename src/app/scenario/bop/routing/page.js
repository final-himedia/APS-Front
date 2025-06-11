"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Toolbar from "@/app/standard/Toolbar";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "routingId", headerName: "라우팅 코드", width: 130 },
  { field: "siteId", headerName: "플랜트", width: 150 },
  { field: "routingName", headerName: "라우팅명", width: 150 },
  { field: "routingType", headerName: "라우팅 타입", width: 120 },
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar />
      </Box>
      <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
        <Typography variant="h6" gutterBottom>
          생산 라우팅 목록
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          autoHeight // ⬅ 높이를 내용에 맞게 자동 조정
          sx={{
            border: 0,
            minWidth: "500px", // 너무 작게 줄어드는 걸 방지
          }}
          rowHeight={38}
        />
      </Box>
    </Box>
  );
}
