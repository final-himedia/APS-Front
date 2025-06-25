"use client";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Toolbar from "@/app/standard/Toolbar"; // ✅ 툴바 임포트

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "workcenter", headerName: "작업장", width: 150 },
  { field: "loadRate", headerName: "가동률", width: 120 },
  { field: "status", headerName: "상태", width: 120 },
];

export default function LoadStatPage() {
  const [rows, setRows] = useState([]);

  // ✅ 엑셀 업로드
  const handleUpload = () => {
    alert("엑셀 업로드 실행");
  };

  // ✅ 엑셀 다운로드
  const handleDownload = () => {
    alert("엑셀 다운로드 실행");
  };

  // ✅ 데이터 가져오기 함수
  const fetchData = () => {
    fetch("http://localhost:8080/api/result/load-stat")
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        작업장 가동현황
      </Typography>

      {/* ✅ 공통 툴바 삽입 */}
      <Toolbar upload={handleUpload} download={handleDownload} />

      {/* ✅ 데이터 테이블 */}
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
