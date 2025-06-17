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
  { field: "id", headerName: "순번", width: 40 },
  { field: "scenarioId", headerName: "시나리오", width: 80 },
  { field: "routingId", headerName: "라우팅 코드", width: 130 },
  { field: "siteId", headerName: "플랜트", width: 60 },
  { field: "routingName", headerName: "라우팅명", width: 150 },
  { field: "routingType", headerName: "라우팅 타입", width: 120 },
];

export default function RoutingMasterView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (scenarioId) fetchRoutingData(scenarioId);
  }, [scenarioId]);

  const fetchRoutingData = (id) => {
    const url = `http://localhost:8080/api/scenarios/bop/routing/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = data.routings || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          scenarioId: item.routingId?.scenarioId || "",
          routingId: item.routingId?.routingId || "",
          siteId: item.routingId?.siteId || "",
          routingName: item.routingName,
          routingType: item.routingType,
        }));
        setRows(formatted);
      })
      .catch((err) => console.error("라우팅 데이터 가져오기 실패:", err));
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("scenarioId", scenarioId);

    fetch("http://localhost:8080/api/scenarios/bop/routing-upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) fetchRoutingData(scenarioId);
        else console.error("업로드 실패");
      })
      .finally(() => setOpen(false));
  };

  const handleDownloadExcel = () => {
    console.log("📦 다운로드 요청 시나리오 ID:", scenarioId);
    window.open(
      `http://localhost:8080/api/scenarios/bop/routing-download?scenarioId=${scenarioId}`,
      "_blank"
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 상단 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownloadExcel} />
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            라우팅 파일 업로드
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
                등록할 파일을 선택하세요.
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
          생산 프로세스
        </Typography>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50, 100]}
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
