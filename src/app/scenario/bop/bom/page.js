"use client";

import { useEffect, useState } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@/app/standard/Toolbar";
import useScenarioStore from "@/hooks/useScenarioStore";

const columns = [
  { field: "id", headerName: "순번", flex: 1 },
  { field: "toSiteId", headerName: "생산 사이트 코드", flex: 1 },
  { field: "toPartId", headerName: "생산 제품 코드", width: 100 },
  { field: "operationId", headerName: "공정 코드", width: 80 },
  { field: "bomCategory", headerName: "BOM 범주", width: 50 },
  { field: "outQty", headerName: "생산 량", width: 60, type: "number" },
  { field: "outUom", headerName: "생산 량 단위", width: 70 },
  { field: "fromSiteId", headerName: "투입 사이트 코드", flex: 1 },
  { field: "fromPartId", headerName: "투입 제품 코드", flex: 1 },
  { field: "inQty", headerName: "투입 량", width: 60, type: "number" },
  { field: "inUom", headerName: "투입 량 단위", width: 60 },
  { field: "createDatetime", headerName: "생성일자", width: 80 },
  { field: "effStartDate", headerName: "BOM 유효 시작일", flex: 1 },
  { field: "createBy", headerName: "생성자", width: 60 },
  { field: "toPartName", headerName: "생산 제품명", width: 80 },
  { field: "fromPartName", headerName: "투입 제품명", width: 80 },
  { field: "zseq", headerName: "순서", flex: 1 },
  { field: "scenarioId", headerName: "시나리오", width: 100 },
  { field: "bomVersion", headerName: "BOM버전", width: 50 },
];

export default function BomView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchBomData = () => {
    if (!scenarioId) return;
    const url = `http://localhost:8080/api/scenarios/bop/bom/${scenarioId}`;
    fetch(url)
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
      })
      .catch((err) => console.error("BOM 데이터 불러오기 실패:", err));
  };

  useEffect(() => {
    fetchBomData();
  }, [scenarioId]);

  const handleDownload = () => {
    window.open(
      `http://localhost:8080/api/scenarios/bop/bom-download?scenarioId=${scenarioId}`,
      "_blank"
    );
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("scenarioId", scenarioId);

    fetch("http://localhost:8080/api/scenarios/bop/bom-upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) fetchBomData();
        else console.error("업로드 실패");
      })
      .finally(() => setOpen(false));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 상단 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownload} />
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            BOM 파일 업로드
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

      {/* ToolMaster 스타일 카드 박스 */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" gutterBottom>
          BOM
        </Typography>

        {/*내부에서만 가로 스크롤 허용 */}
        <Box sx={{ flex: 1, overflowX: "auto", overflowY: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            autoHeight={false}
            rowHeight={38}
            sx={{
              border: 0,
              minWidth: "1300px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
