"use client";

import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import Toolbar from "@/app/standard/Toolbar";
import CloseIcon from "@mui/icons-material/Close";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", width: 120 },
  { field: "routingId", headerName: "ROUTING 코드", width: 130 },
  { field: "operationId", headerName: "공정 코드", width: 150 },
  { field: "operationName", headerName: "공정명", width: 180 },
  { field: "operationSeq", headerName: "공정 순서", width: 120 },
  { field: "operationType", headerName: "공정 유형", width: 130 },
  { field: "createDatetime", headerName: "생성일자", width: 180 },
  { field: "updateDatetime", headerName: "수정일자", width: 180 },
  { field: "scenarioId", headerName: "시나리오", width: 130 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 📥 다운로드
  const handleDownload = () => {
    window.open(
      "http://localhost:8080/api/scenarios/bop/operation-routing-download",
      "_blank"
    );
  };

  // 📤 업로드 열기/닫기
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  // 📡 데이터 불러오기
  const fetchData = () => {
    fetch("http://localhost:8080/api/scenarios/bop/operationRouting")
      .then((res) => res.json())
      .then((data) => {
        const list = data.operationRoutings || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.operationRoutingId?.siteId ?? "",
          routingId: item.operationRoutingId?.routingId ?? "",
          operationId: item.operationRoutingId?.operationId ?? "",
          operationSeq: item.operationRoutingId?.operationSeq ?? "",
          operationName: item.operationName,
          operationType: item.operationType,
          scenarioId: item.scenarioId,
          createDatetime: item.createDatetime,
          updateDatetime: item.updateDatetime,
        }));

        setRows(formatted);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📂 업로드 파일 변경 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
      setOpen(false);
    }
  };

  // 📤 업로드 요청
  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:8080/api/scenarios/bop/operation-routing-upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 200) fetchData();
      else console.error("업로드 실패");
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownload} />

        {/* 업로드 다이얼로그 */}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            공정 순서 파일 업로드
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 1,
                height: 150,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("file-input").click()}
            >
              <Typography color="text.secondary">
                등록할 파일을 선택해서 추가하세요.
              </Typography>
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog}>취소</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* 테이블 */}
      <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
        <Typography variant="h6" gutterBottom>
          공정 순서
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
            minWidth: "500px",
          }}
          rowHeight={38}
        />
      </Box>
    </Box>
  );
}
