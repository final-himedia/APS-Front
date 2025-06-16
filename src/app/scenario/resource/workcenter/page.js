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
  { field: "workcenterId", headerName: "작업장 코드", width: 150 },
  { field: "workcenterName", headerName: "호기명", width: 130 },
  { field: "workcenterGroup", headerName: "호기그룹", width: 130 },
  { field: "workcenterType", headerName: "호기유형", width: 130 },
  { field: "priorityId", headerName: "우선순위 그룹", width: 150 },
  { field: "dispatcherType", headerName: "디스패치 방식", width: 130 },
  { field: "workcenterState", headerName: "호기 상태", width: 120 },
  { field: "automation", headerName: "자동화 장비", width: 130 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function WorkCenter() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDownload = () => {
    window.open(
      "http://localhost:8080/api/scenarios/workcenter-download",
      "_blank"
    );
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

    fetch("http://localhost:8080/api/scenarios/workcenter-upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 200) fetchData();
      else console.error("업로드 실패");
    });
  };

  const fetchData = () => {
    fetch("http://localhost:8080/api/scenarios/resource/workcenter")
      .then((res) => res.json())
      .then((data) => {
        console.log("백엔드에서 받은 데이터 개수:", data.workcenters.length);
        const list = data.workcenters || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.workCenterId?.siteId || "",
          workcenterId: item.workCenterId?.workcenterId || "",
          scenarioId: item.workCenterId?.scenarioId || "",
          workcenterName: item.workcenterName,
          workcenterGroup: item.workcenterGroup,
          workcenterType: item.workcenterType,
          priorityId: item.priorityId,
          dispatcherType: item.dispatcherType,
          workcenterState: item.workcenterState,
          automation: item.automation,
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

        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            작업장 마스터 파일 업로드
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

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          작업장 마스터
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
