import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const rows = [
  {
    id: 1,
    itemCode: "F404",
    itemName: "TA-50 본관기 F404 엔진",
    customer: "100001",
    dueDate: "2025-02-14",
    orderAmount: 1,
    priority: 1,
  },
  {
    id: 2,
    itemCode: "F404",
    itemName: "TA-50 본관기 F404 엔진",
    customer: "100001",
    dueDate: "2025-03-01",
    orderAmount: 1,
    priority: 1,
  },
];

const columns = [
  { field: "itemCode", headerName: "순번", width: 120 },
  { field: "itemName", headerName: "생산 사이트 코드", width: 200 },
  { field: "customer", headerName: "생산 제품 코드", width: 100 },
  { field: "dueDate", headerName: "공정 코드", width: 150 },
  { field: "orderAmount", headerName: "BOM 범주", width: 100 },
  { field: "priority", headerName: "생산 량", width: 100 },
];

export default function DataGridSection() {
  return (
    <Box p={3} flex={1}>
      <Typography variant="h6" gutterBottom>
        시나리오 관리
      </Typography>
      <DataGrid rows={rows} columns={columns} autoHeight />
    </Box>
  );
}
