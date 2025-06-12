"use client";


import Box from "@mui/material/Box";
import Toolbar from "@/app/standard/Toolbar";

export default function BopPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar />
      </Box>

      {/* 가운데 콘텐츠 (스크롤 영역 포함) */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <h2>BOM</h2>
        <p>여기에 BOM 관련 테이블 넣기</p>
      </Box>

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "toSiteId", headerName: "생산 사이트 코드", width: 130 },
  { field: "toPartId", headerName: "생산 제품 코드", width: 130 },
  { field: "operationId", headerName: "공정 코드", width: 130 },
  { field: "bomCategory", headerName: "BOM 범주", width: 100 },
  { field: "outQty", headerName: "생산 량", width: 100, type: "number" },
  { field: "outUom", headerName: "생산 량 단위", width: 100 },
  { field: "fromSiteId", headerName: "투입 사이트 코드", width: 120 },
  { field: "fromPartId", headerName: "투입 제품 코드", width: 130 },
  { field: "inQty", headerName: "투입 량", width: 100, type: "number" },
  { field: "inUom", headerName: "투입 량 단위", width: 100 },
  { field: "createDatetime", headerName: "생성일자", width: 180 },
  { field: "effStartDate", headerName: "BOM 유효 시작일", width: 180 },
  { field: "createBy", headerName: "생성자", width: 100 },
  { field: "toPartName", headerName: "생산 제품명", width: 150 },
  { field: "fromPartName", headerName: "투입 제품명", width: 150 },
  { field: "zseq", headerName: "순서", width: 80 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "bomVersion", headerName: "BOM버전", width: 100 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/bop/bom")
      .then((res) => res.json())
      .then((data) => {
        const list = data.boms || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          toSiteId: item.bomId?.toSiteId ?? "",
          toPartId: item.bomId?.toPartId ?? "",
          operationId: item.operationId,
          bomCategory: item.bomCategory,
          outQty: item.outQty,
          outUom: item.outUom,
          fromSiteId: item.bomId?.fromSiteId ?? "",
          fromPartId: item.bomId?.fromPartId ?? "",
          inQty: item.inQty,
          inUom: item.inUom,
          createDatetime: item.createDatetime,
          effStartDate: item.effStartDate,
          createBy: item.createBy,
          toPartName: item.toPartName,
          fromPartName: item.fromPartName,
          zseq: item.bomId?.zseq ?? "",
          scenarioId: item.scenarioId,
          bomVersion: item.bomVersion,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
      <Typography variant="h6" gutterBottom>
        BOM
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
