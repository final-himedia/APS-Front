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
  { field: "siteId", headerName: "플랜트", width: 120 },
  { field: "toolId", headerName: "ToolId", width: 150 },
  { field: "toolState", headerName: "상태", width: 130 },
  { field: "toolCavity", headerName: "핀바 보유 수량", width: 130 },
  { field: "scenarioId", headerName: "시나리오", width: 130 },
  { field: "toolName", headerName: "ToolName", width: 180 },
];

export default function ToolMaster() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDownload = () => {
    window.open("http://localhost:8080/api/scenarios/tool-download", "_blank");
  };

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

    fetch("http://localhost:8080/api/scenarios/tool-upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 200) fetchData();
      else console.error("업로드 실패");
    });
  };

  const fetchData = () => {
    fetch("http://localhost:8080/api/scenarios/resource/tool-master")
      .then((res) => res.json())
      .then((data) => {
        console.log("받은 row 수:", data.total);
        const list = data.toolMasters || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.toolMasterId.siteId,
          toolId: item.toolMasterId.toolId,
          scenarioId: item.toolMasterId.scenarioId,
          toolState: item.toolState,
          toolCavity: item.toolCavity,
          toolName: item.toolName,
        }));

        setRows(formatted);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            작업도구 마스터 파일 업로드
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
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          작업도구 마스터
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
          autoHeight
          sx={{ border: 0, minWidth: "500px" }}
          rowHeight={38}
        />
      </Box>
    </Box>
  );
}
