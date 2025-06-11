"use client";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "순번" },
  { field: "demandId", headerName: "판매오더번호" },
  { field: "siteId", headerName: "플랜트" },
  { field: "partId", headerName: "품목코드" },
  { field: "partName", headerName: "품목명" },
  { field: "customerId", headerName: "고객사" },
  { field: "dueDate", headerName: "납기일" },
  { field: "demandQty", headerName: "주문수량" },
  { field: "priority", headerName: "우선순위" },
  { field: "uom", headerName: "단위" },
  { field: "orderType", headerName: "주문유형" },
  { field: "orderTypeName", headerName: "주문유형내역" },
  { field: "exceptYn", headerName: "제외주문" },
  { field: "headerCreationDate", headerName: "오더생성일" },
  { field: "hasOverActQty", headerName: "초과실적보유주문FLAG" },
  { field: "scenarioId", headerName: "시나리오" },
];

export default function demand() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/target/demand")
      .then((res) => res.json())
      .then((data) => {
        const list = data.demands || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          demandId: item.demandId?.demandId,
          siteId: item.demandId?.siteId || "",
          partId: item.demandId?.partId || "",
          partName: item.partName,
          customerId: item.customerId,
          dueDate: item.dueDate,
          demandQty: item.demandQty,
          priority: item.priority,
          uom: item.uom,
          orderType: item.orderType,
          orderTypeName: item.orderTypeName,
          exceptYn: item.exceptYn,
          headerCreationDate: item.headerCreationDate,
          hasOverActQty: item.hasOverActQty,
          scenarioId: item.scenarioId,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        판매 오더
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
