"use client";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "workcenter", headerName: "작업장", width: 150 },
  { field: "planDate", headerName: "계획 일자", width: 130 },
  { field: "productName", headerName: "제품명", width: 180 },
  { field: "planQty", headerName: "계획 수량", width: 130 },
];

export default function WorkcenterPlanPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/result/workcenter-plan")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data?.resultList || []).map((item, index) => ({
          id: index + 1,
          workcenter: item.workcenter,
          planDate: item.planDate ?? "-",
          productName: item.productName ?? "-",
          planQty: item.planQty ?? 0,
        }));
        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        작업장 별 생산계획
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0, mt: 1 }}
        rowHeight={38}
      />
    </Box>
  );
}
