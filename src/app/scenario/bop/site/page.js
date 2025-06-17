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
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", flex: 1 },
  { field: "siteName", headerName: "사이트명", flex: 2 },
  { field: "scenarioId", headerName: "시나리오", flex: 1 },
];

export default function PlantMasterView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchSiteData = () => {
    const url = `http://localhost:8080/api/scenarios/bop/site/${scenarioId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = data.sites || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId,
          siteName: item.siteName,
          scenarioId: item.scenarioId,
        }));
        setRows(formatted);
      })
      .catch((err) => console.error("플랜트 데이터 불러오기 실패:", err));
  };

  useEffect(() => {
    fetchSiteData();
  }, [scenarioId]);

  const handleDownload = () => {
    window.open(
      `http://localhost:8080/api/scenarios/bop/site-download?scenarioId=${scenarioId}`,
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
    if (scenarioId) formData.append("scenarioId", scenarioId);

    fetch("http://localhost:8080/api/scenarios/bop/site-upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) fetchSiteData();
        else console.error("업로드 실패");
      })
      .finally(() => setOpen(false));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownload} />
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            플랜트 파일 업로드
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

      {/* ToolMaster 스타일 Box */}
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
          플랜트 마스터
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
            sx={{ border: 0, minWidth: "800px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
