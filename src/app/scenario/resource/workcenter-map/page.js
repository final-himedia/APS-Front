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
  { field: "routingId", headerName: "Routing 코드", width: 130 },
  { field: "partId", headerName: "품목코드", width: 130 },
  { field: "operationId", headerName: "공정 코드", width: 130 },
  { field: "routingGroup", headerName: "Routing그룹", width: 130 },
  { field: "routingVersion", headerName: "Routing버전", width: 130 },
  { field: "workcenterId", headerName: "작업장코드", width: 130 },
  { field: "tactTime", headerName: "생산간격", width: 120 },
  { field: "tactTimeUom", headerName: "생산간격단위", width: 130 },
  { field: "procTime", headerName: "Unit당 생산시간", width: 130 },
  { field: "procTimeUom", headerName: "Unit당 생산 시간 단위", width: 150 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function WorkCenterMap() {
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
      "http://localhost:8080/api/scenarios/workcentermap-download",
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

    fetch("http://localhost:8080/api/scenarios/workcentermap-upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 200) fetchData();
      else console.error("업로드 실패");
    });
  };

  const fetchData = () => {
    fetch("http://localhost:8080/api/scenarios/resource/workcentermap")
      .then((res) => res.json())
      .then((data) => {
        const list = data.workcenterMaps || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId || "",
          routingId: item.routingId || "",
          partId: item.partId || "",
          operationId: item.workCenterMapId?.operationId || "",
          workcenterId: item.workCenterMapId?.workcenterId || "",
          scenarioId: item.workCenterMapId?.scenarioId || "",
          routingGroup: item.routingGroup || "",
          routingVersion: item.routingVersion || "",
          tactTime: item.tactTime || "",
          tactTimeUom: item.tactTimeUom || "",
          procTime: item.procTime || "",
          procTimeUom: item.procTimeUom || "",
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
            생산-라우팅 맵 파일 업로드
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
          생산 라우팅 맵
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
          autoHeight
          sx={{ border: 0, minWidth: "1000px" }}
          rowHeight={38}
        />
      </Box>
    </Box>
  );
}
