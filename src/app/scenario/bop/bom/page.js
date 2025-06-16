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

// BOM 테이블 컬럼 정의
const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "toSiteId", headerName: "생산 사이트 코드", width: 130 },
  { field: "toPartId", headerName: "생산 제품 코드", width: 130 },
  { field: "operationId", headerName: "공정 코드", width: 130 },
  { field: "bomCategory", headerName: "BOM 범주", width: 100 },
  { field: "outQty", headerName: "생산 량", width: 100, type: "number" },
  { field: "outUom", headerName: "생산 량 단위", width: 100 },
  { field: "fromSiteId", headerName: "투입 사이트 코드", width: 120 },
  { field: "fromPartId", headerName: "투입 제품 코드", width: 130 },
  { field: "inQty", headerName: "투입 량", width: 100, type: "number" },
  { field: "inUom", headerName: "투입 량 단위", width: 100 },
  { field: "createDatetime", headerName: "생성일자", width: 180 },
  { field: "effStartDate", headerName: "BOM 유효 시작일", width: 180 },
  { field: "createBy", headerName: "생성자", width: 100 },
  { field: "toPartName", headerName: "생산 제품명", width: 150 },
  { field: "fromPartName", headerName: "투입 제품명", width: 150 },
  { field: "zseq", headerName: "순서", width: 80 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "bomVersion", headerName: "BOM버전", width: 100 },
];

// DataGridSection 컴포넌트
function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelectedFile] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const fetchBomData = () => {
    fetch("http://localhost:8080/api/scenarios/bop/bom")
      .then((res) => res.json())
      .then((data) => {
        const list = data.boms || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          toSiteId: item.bomId?.toSiteId ?? "",
          toPartId: item.bomId?.toPartId ?? "",
          operationId: item.operationId,
          bomCategory: item.bomCategory,
          outQty: item.outQty,
          outUom: item.outUom,
          fromSiteId: item.bomId?.fromSiteId ?? "",
          fromPartId: item.bomId?.fromPartId ?? "",
          inQty: item.inQty,
          inUom: item.inUom,
          createDatetime: item.createDatetime,
          effStartDate: item.effStartDate,
          createBy: item.createBy,
          toPartName: item.toPartName,
          fromPartName: item.fromPartName,
          zseq: item.bomId?.zseq ?? "",
          scenarioId: item.bomId?.scenarioId,
          bomVersion: item.bomVersion,
        }));

        setRows(formatted);
      });
  };

  useEffect(() => {
    fetchBomData();
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
    fetch("http://localhost:8080/api/scenarios/bop/bom-upload", {
      method: "post",
      body: formData,
    }).then((response) => {
      if (response.status === 200) fetchBomData();
      else console.error("업로드 실패");
    });
  };

  const handleDownloadExcel = () => {
    window.location.href =
      "http://localhost:8080/api/scenarios/bop/bom-download";
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
          BOM
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          checkboxSelection
          autoHeight
          rowHeight={38}
          sx={{ border: 0, minWidth: "500px" }}
        />
      </Box>
    </Box>
  );
}
