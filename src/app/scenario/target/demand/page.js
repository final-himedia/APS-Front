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
  { field: "demandId", headerName: "판매오더번호", width: 150 },
  { field: "siteId", headerName: "플랜트", width: 100 },
  { field: "partId", headerName: "품목코드", width: 130 },
  { field: "partName", headerName: "품목명", width: 130 },
  { field: "customerId", headerName: "고객사", width: 130 },
  { field: "dueDate", headerName: "납기일", width: 130 },
  { field: "demandQty", headerName: "주문수량", width: 100 },
  { field: "priority", headerName: "우선순위", width: 100 },
  { field: "uom", headerName: "단위", width: 80 },
  { field: "orderType", headerName: "주문유형", width: 100 },
  { field: "orderTypeName", headerName: "주문유형내역", width: 130 },
  { field: "exceptYn", headerName: "제외주문", width: 100 },
  { field: "headerCreationDate", headerName: "오더생성일", width: 130 },
  { field: "hasOverActQty", headerName: "초과실적보유주문FLAG", width: 180 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
];

export default function Demand() {
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
      "http://localhost:8080/api/scenarios/target/demand-download",
      "_blank"
    );
  };

  // 📤 업로드 다이얼로그
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

    fetch("http://localhost:8080/api/scenarios/target/demand-upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status === 200) fetchData();
      else console.error("업로드 실패");
    });
  };

  const fetchData = () => {
    fetch("http://localhost:8080/api/scenarios/target/demand")
      .then((res) => res.json())
      .then((data) => {
        const list = data.demands || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          demandId: item.demandId?.demandId,
          siteId: item.demandId?.siteId || "",
          partId: item.demandId?.partId || "",
          partName: item.partName,
          customerId: item.customerId,
          dueDate: item.dueDate,
          demandQty: item.demandQty,
          priority: item.priority,
          uom: item.uom,
          orderType: item.orderType,
          orderTypeName: item.orderTypeName,
          exceptYn: item.exceptYn,
          headerCreationDate: item.headerCreationDate,
          hasOverActQty: item.hasOverActQty,
          scenarioId: item.scenarioId,
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
            판매오더 파일 업로드
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
          판매 오더
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
          sx={{ border: 0, minWidth: "1200px" }}
          rowHeight={38}
        />
      </Box>
    </Box>
  );
}
