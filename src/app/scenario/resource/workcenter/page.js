"use client";

import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "순번" },
  { field: "siteId", headerName: "플랜트" },
  { field: "workcenterId", headerName: "작업장 코드" },
  { field: "workcenterName", headerName: "호기명" },
  { field: "workcenterGroup", headerName: "호기그룹" },
  { field: "workcenterType", headerName: "호기유형" },
  { field: "priorityId", headerName: "우선순위 그룹" },
  { field: "dispatcherType", headerName: "디스패치 방식" },
  { field: "workcenterState", headerName: "호기 상태" },
  { field: "automation", headerName: "자동화 장비" },
  { field: "scenarioId", headerName: "시나리오" },
];

export default function WorkCenter() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/resource/workcenter")
      .then((res) => res.json())
      .then((data) => {
        const list = data.workcenters || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId,
          workcenterId: item.workcenterId,
          workcenterName: item.workcenterName,
          workcenterGroup: item.workcenterGroup,
          workcenterType: item.workcenterType,
          priorityId: item.priorityId,
          dispatcherType: item.dispatcherType,
          workcenterState: item.workcenterState,
          automation: item.automation,
          scenarioId: item.scenarioId,
        }));

        setRows(formatted);
      });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        작업장 마스터
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
