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
import useScenarioStore from "@/hooks/useScenarioStore";

const columns = [
  { field: "id", headerName: "순번", width: 30 },
  { field: "siteId", headerName: "플랜트", width: 60 },
  { field: "partId", headerName: "품목 코드", width: 80 },
  { field: "partType", headerName: "Part 유형", width: 80 },
  { field: "routingId", headerName: "Routing 코드", width: 100 },
  { field: "partName", headerName: "품목명", flex :1 },
  { field: "minBatchSize", headerName: "생산 배치 사이즈(최소)", flex :1 },
  { field: "maxBatchSize", headerName: "생산 배치 사이즈(최대)", flex :1 },
  { field: "uom", headerName: "단위", width: 40 },
  { field: "scenarioId", headerName: "시나리오", width: 80 },
];

export default function PartMasterView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (scenarioId) fetchPartData(scenarioId);
  }, [scenarioId]);

  const fetchPartData = (id) => {
    fetch(`http://localhost:8080/api/scenarios/bop/part/${id}`)
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
          scenarioId: item.partId?.scenarioId,
        }));
        setRows(formatted);
      })
      .catch((err) => console.error("자재 마스터 데이터 실패:", err));
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("scenarioId", scenarioId);

    fetch("http://localhost:8080/api/scenarios/bop/part-upload", {
      method: "post",
      body: formData,
    })
      .then((response) => {
        if (response.ok) fetchPartData(scenarioId);
        else console.error("업로드 실패");
      })
      .finally(() => setOpen(false));
  };

  const handleDownloadExcel = () => {
    console.log("📦 다운로드 요청 시나리오 ID:", scenarioId);
    window.open(
      `http://localhost:8080/api/scenarios/bop/part-download?scenarioId=${scenarioId}`,
      "_blank"
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 상단 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownloadExcel} />
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
            자재 마스터 업로드
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

      {/* 카드형 테이블 박스 */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          p: 2,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          자재 마스터
        </Typography>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            autoHeight={false}
            rowHeight={38}
            sx={{ border: 0, minWidth: "1000px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
