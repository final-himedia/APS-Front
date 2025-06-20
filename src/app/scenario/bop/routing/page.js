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
  { field: "id", headerName: "순번", width: 80 },
  { field: "scenarioId", headerName: "시나리오", flex: 1 },
  { field: "routingId", headerName: "라우팅 코드", flex: 1 },
  { field: "siteId", headerName: "플랜트", flex: 1 },
  { field: "routingName", headerName: "라우팅명", flex: 1 },
  { field: "routingType", headerName: "라우팅 타입", flex: 1 },
];

export default function RoutingMasterView() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const setScenarioId = useScenarioStore(
    (state) => state.setSelectedScenarioId
  );
  const [token, setToken] = useState(null);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!scenarioId) setScenarioId("S010000");
  }, [scenarioId, setScenarioId]);

  const fetchRoutingData = (token, id) => {
    if (!token || !id) return;
    fetch(`http://localhost:8080/api/scenarios/bop/routing/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
      .catch((err) => console.error("라우팅 데이터 불러오기 실패:", err));
  };

  useEffect(() => {
    if (token && scenarioId) fetchRoutingData(token, scenarioId);
  }, [token, scenarioId]);

  const handleDownloadExcel = () => {
    if (!token || !scenarioId) return;
    window.open(
      `http://localhost:8080/api/scenarios/bop/routing-download?scenarioId=${scenarioId}`,
      "_blank"
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !token || !scenarioId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scenarioId", scenarioId);

    fetch("http://localhost:8080/api/scenarios/bop/routing-upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) fetchRoutingData(token, scenarioId);
        else console.error("업로드 실패");
      })
      .finally(() => setOpen(false));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={() => setOpen(true)} download={handleDownloadExcel} />
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            라우팅 파일 업로드
            <IconButton onClick={() => setOpen(false)}>
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
            <Button onClick={() => setOpen(false)}>취소</Button>
          </DialogActions>
        </Dialog>
      </Box>

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
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f2e8e8",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#f2e8e8",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000",
                fontWeight: "bold",
              },
              border: 0,
              minWidth: "1000px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
