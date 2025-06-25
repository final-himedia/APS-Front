"use client";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Toolbar from "@/app/standard/Toolbar";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "workcenter", headerName: "작업장", width: 150 },
  { field: "loadRate", headerName: "가동률", width: 120 },
  { field: "status", headerName: "상태", width: 120 },
];

export default function LoadStatPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/result/lot-merge-history")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data?.resultList || []).map((item, index) => ({
          id: index + 1,
          workcenter: item.workcenter,
          loadRate: item.loadRate + "%",
          status: item.status ?? "-",
        }));
        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6">작업장 가동현황</Typography>
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
