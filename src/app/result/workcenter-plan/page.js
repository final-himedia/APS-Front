"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ResultToolBar from "@/app/standard/ResultToolBar";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "workcenter", headerName: "작업장", width: 150 },
  { field: "planDate", headerName: "계획 일자", width: 130 },
  { field: "productName", headerName: "제품명", width: 180 },
  { field: "planQty", headerName: "계획 수량", flex:1 },
];

export default function WorkcenterPlanView() {
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 영역 (업로드/다운로드 버튼 자리) */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <ResultToolBar upload={() => {}} download={() => {}} />
      </Box>

      {/* 메인 카드 박스 */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" gutterBottom>
          작업장 별 생산계획
        </Typography>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            autoHeight={false}
            rowHeight={38}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f2e8e8",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000",
                fontWeight: "bold",
              },
              border: 0,
              minWidth: "900px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
