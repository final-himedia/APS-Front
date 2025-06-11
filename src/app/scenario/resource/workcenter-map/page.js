"use client";

import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "순번" },
  { field: "siteId", headerName: "플랜트" },
  { field: "routingId", headerName: "Routing 코드" },
  { field: "partId", headerName: "품목코드" },
  { field: "operationId", headerName: "공정 코드" },
  { field: "routingGroup", headerName: "Routing그룹" },
  { field: "routingVersion", headerName: "Routing버전" },
  { field: "workcenterId", headerName: "작업장코드" },
  { field: "tactTime", headerName: "생산간격" },
  { field: "tactTimeUom", headerName: "생산간격단위" },
  { field: "procTime", headerName: "Unit당 생산시간" },
  { field: "procTimeUom", headerName: "Unit당 생산 시간 단위" },
  { field: "scenarioId", headerName: "시나리오" },
];

export default function WorkCenterMap() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/resource/workcentermap")
      .then((res) => res.json())
      .then((data) => {
        const list = data.workcenterMaps || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId,
          routingId: item.routingId,
          partId: item.partId,
          operationId: item.operationId,
          routingGroup: item.routingGroup,
          routingVersion: item.routingVersion,
          workcenterId: item.workcenterId,
          tactTime: item.tactTime,
          tactTimeUom: item.tactTimeUom,
          procTime: item.procTime,
          procTimeUom: item.procTimeUom,
          scenarioId: item.scenarioId,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        생산 라우팅
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxSelection
        sx={{ border: 0 }}
        rowHeight={38}
      />
    </Box>
  );
}
