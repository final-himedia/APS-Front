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
  { field: "siteId", headerName: "플랜트", width: 100 },
  { field: "partId", headerName: "품목 코드", width: 130 },
  { field: "partType", headerName: "Part 유형", width: 180 },
  { field: "routingId", headerName: "Routing 코드", width: 100 },
  { field: "partName", headerName: "품목명", width: 100 },
  { field: "minBatchSize", headerName: "생산 배치 사이즈(최소)", width: 120 },
  { field: "maxBatchSize", headerName: "생산 배치 사이즈(최대)", width: 130 },
  { field: "uom", headerName: "단위", width: 120 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelectedFile] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const fetchPartData = () => {
    fetch("http://localhost:8080/api/scenarios/bop/part")
      .then((res) => res.json())
      .then((data) => {
        const list = data.parts || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.partId?.siteId,
          partId: item.partId?.partId,
          partType: item.partId?.partType,
          routingId: item.routingId,
          partName: item.partName,
          minBatchSize: item.minBatchSize,
          maxBatchSize: item.maxBatchSize,
          uom: item.uom,
          scenarioId: item.scenarioId,
        }));

        setRows(formatted);
      });
  };

  useEffect(() => {
    fetchPartData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
      setOpen(false);
    }
  };

  const handleUpload = (file) => {
    console.log("check!!");
    const formData = new FormData();
    formData.append("file", file);
    fetch("http://localhost:8080/api/scenarios/bop/part-upload", {
      method: "post",
      body: formData,
    }).then((response) => {
      if (response.status === 200) fetchPartData();
      else console.error("업로드 실패");
    });
  };

  const handleDownloadExcel = () => {
    window.location.href =
      "http://localhost:8080/api/scenarios/bop/part-download";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}

      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownloadExcel} />

        {/* 업로드 Dialog */}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            파일 업로드
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

      <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
        <Typography variant="h6" gutterBottom>
          자재 마스터
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          autoHeight
          sx={{ border: 0, minWidth: "500px" }}
          rowHeight={38}
        />
      </Box>
    </Box>
  );
}
