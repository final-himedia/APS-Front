"use client";

import Toolbar from "@/app/standard/Toolbar";
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
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", width: 100 },
  { field: "toolSize", headerName: "TOOL 사이즈", width: 100 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "partId", headerName: "품목 코드", width: 130 },
  { field: "toolId", headerName: "ToolId", width: 120 },
  { field: "partName", headerName: "품목명", width: 180 },
];

export default function ToolMap() {
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
      "http://localhost:8080/api/scenarios/toolmap-download",
      "_blank"
    );
  };

  // 📤 업로드 다이얼로그 열기/닫기
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
      setOpen(false);
    }
  };

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:8080/api/scenarios/toolmap-upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 200) fetchData();
      else console.error("업로드 실패");
    });
  };

  const fetchData = () => {
    fetch("http://localhost:8080/api/scenarios/resource/tool-map")
      .then((res) => res.json())
      .then((data) => {
        const list = data.toolMasters || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId || "",
          toolSize: item.toolSize || "",
          scenarioId: item.toolMapId?.scenarioId || "",
          partId: item.toolMapId?.partId || "",
          toolId: item.toolMapId?.toolId || "",
          partName: item.partName || "",
        }));

        setRows(formatted);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownload} />

        {/* 업로드 다이얼로그 */}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            작업장-도구 매핑 파일 업로드
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
      <Box sx={{ flex: 1, p: 2, minHeight: 300 }}>
        <Typography variant="h6" gutterBottom>
          작업장-도구 매핑관리
        </Typography>

        <Box sx={{ height: 500, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            checkboxSelection
            rowHeight={38}
            sx={{ border: 0, minWidth: "1000px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
