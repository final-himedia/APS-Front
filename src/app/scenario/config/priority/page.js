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
  { field: "priorityId", headerName: "우선순위 그룹", width: 150 },
  { field: "factorId", headerName: "우선순위", width: 180 },
  { field: "factorType", headerName: "FactorType", width: 130 },
  { field: "orderType", headerName: "주문유형", width: 100 },
  { field: "sequence", headerName: "우선순위 순서", width: 120, type: "number" },
  { field: "description", headerName: "설명", width: 250 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDownload = () => {
    window.open("http://localhost:8080/api/scenarios/config/priority-download", "_blank");
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const fetchData = () => {
    fetch("http://localhost:8080/api/scenarios/config/priority")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.prioritys)) return;

        const formatted = data.prioritys.map((item, index) => {
          const pid = item.priorityId || {};
          return {
            id: index + 1,
            scenarioId: pid.scenarioId || "",
            priorityId: pid.priorityId || "",
            factorId: pid.factorId || "",
            factorType: item.factorType || "",
            orderType: item.orderType || "",
            sequence: item.sequence || 0,
            description: item.description || "",
          };
        });

        setRows(formatted);
      })
      .catch((err) => {
        console.error("우선순위 데이터 불러오기 실패", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:8080/api/scenarios/config/priority-upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          fetchData();
        } else {
          console.error("업로드 실패");
        }
      })
      .finally(() => {
        handleCloseDialog();
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownload} />

        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
            우선순위 파일 업로드
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
              onClick={() => document.getElementById("file-input")?.click()}
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
          우선순위
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
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
