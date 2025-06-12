"use client";

import Toolbar from "@/app/standard/Toolbar";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "순번" },
  { field: "siteId", headerName: "플랜트" },
  { field: "toolId", headerName: "작업장 코드" },
  { field: "toolState", headerName: "호기명" },
  { field: "toolCavity", headerName: "호기그룹" },
  { field: "scenarioId", headerName: "호기유형" },
  { field: "toolName", headerName: "우선순위 그룹" },
];

export default function ToolMaster() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/scenarios/resource/tool-master")
      .then((res) => res.json())
      .then((data) => {
        const list = data.toolMasters || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId,
          toolId: item.toolId,
          toolState: item.toolState,
          toolCavity: item.toolCavity,
          scenarioId: item.scenarioId,
          toolName: item.toolName,
        }));

        setRows(formatted);
      });
  }, []);

  const handleUpload = function (evt) {
    //파일 백으로 보내고, 응답받아서
    //파일 보내고자 할때는 보내고자 하는 파일을 FormData 객체를 이용해서 전송, header 설정은 할 필요 없음( 더 복잡해짐)
    const formData = new FormData();
    formData.append("attachment", file);
    fetch("http://127.0.0.1:8080/api/musical/batch", {
      method: "post",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleUpload} />
      </Box>

      <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
        <Typography variant="h6" gutterBottom>
          작업도구 마스터
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
    </Box>
  );
}
