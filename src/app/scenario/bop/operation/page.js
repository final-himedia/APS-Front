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
  { field: "operationId", headerName: "공정 코드", width: 130 },
  { field: "operationName", headerName: "공정 명", width: 180 },
  { field: "runTime", headerName: "공정 실행 시간", width: 100 },
  { field: "yield", headerName: "공정 수율", width: 100 },
  { field: "runTimeUom", headerName: "실행 시간 단위", width: 120 },
  { field: "operationType", headerName: "공정 유형", width: 130 },
  { field: "waitTimeUom", headerName: "대기시간 단위", width: 120 },
  { field: "transferTimeUom", headerName: "이동시간 단위", width: 120 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "sourcingType", headerName: "sourcingType", width: 120 },
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

  const fetchOperationData = () => {
    fetch("http://localhost:8080/api/scenarios/bop/operation")
      .then((res) => res.json())
      .then((data) => {
        const list = data.operations || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.operationId?.siteId,
          operationId: item.operationId?.operationId,
          operationName: item.operationName,
          runTime: item.runTime,
          yield: item.yield,
          runTimeUom: item.runTimeUom,
          operationType: item.operationType,
          waitTimeUom: item.waitTimeUom,
          transferTimeUom: item.transferTimeUom,
          scenarioId: item.scenarioId,
          sourcingType: item.sourcingType,
        }));

        setRows(formatted);
      });
  };

  useEffect(() => {
    fetchOperationData();
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
    fetch("http://localhost:8080/api/scenarios/bop/operation-upload", {
      method: "post",
      body: formData,
    }).then((response) => {
      if (response.status === 200) fetchOperationData();
      else console.error("업로드 실패");
    });
  };

  const handleDownloadExcel = () => {
    window.location.href =
      "http://localhost:8080/api/scenarios/bop/operation-download";
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
          공정 마스터
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 100, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
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
