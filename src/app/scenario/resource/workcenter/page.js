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
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@/app/standard/Toolbar";
import useScenarioStore from "@/hooks/useScenarioStore";

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "siteId", headerName: "플랜트", flex: 1 },
  { field: "workcenterId", headerName: "작업장 코드", flex: 1 },
  { field: "workcenterName", headerName: "호기명", flex: 1 },
  { field: "workcenterGroup", headerName: "호기그룹", flex: 1 },
  { field: "workcenterType", headerName: "호기유형", flex: 1 },
  { field: "priorityId", headerName: "우선순위 그룹", flex: 1 },
  { field: "dispatcherType", headerName: "디스패치 방식", flex: 1 },
  { field: "workcenterState", headerName: "호기 상태", flex: 1 },
  { field: "automation", headerName: "자동화 장비", flex: 1 },
  { field: "scenarioId", headerName: "시나리오", flex: 1 },
];

export default function WorkCenter() {
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

  const fetchData = (token, id) => {
    if (!token || !id) return;

    fetch(`http://15.164.98.31:8080/api/scenarios/resource/workcenter/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = data.workcenters || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.workCenterId?.siteId || "",
          workcenterId: item.workCenterId?.workcenterId || "",
          scenarioId: item.workCenterId?.scenarioId || "",
          workcenterName: item.workcenterName || "",
          workcenterGroup: item.workcenterGroup || "",
          workcenterType: item.workcenterType || "",
          priorityId: item.priorityId || "",
          dispatcherType: item.dispatcherType || "",
          workcenterState: item.workcenterState || "",
          automation: item.automation || "",
        }));
        setRows(formatted);
      })
      .catch((err) => console.error("작업장 마스터 fetch 실패:", err));
  };

  useEffect(() => {
    if (scenarioId && token) {
      fetchData(token, scenarioId);
    }
  }, [scenarioId, token]);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !token || !scenarioId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scenarioId", scenarioId);

    fetch("http://15.164.98.31:8080/api/scenarios/resource/workcenter-upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) fetchData(token, scenarioId);
        else console.error("업로드 실패");
      })
      .finally(() => setOpen(false));
  };

  const handleDownload = () => {
    if (!token || !scenarioId) return;

    fetch(
      `http://15.164.98.31:8080/api/scenarios/resource/workcenter-download?scenarioId=${scenarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("다운로드 실패");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "workcenter.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => console.error("다운로드 오류:", err));
  };

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
            <Button onClick={handleCloseDialog} sx={{ color: "#000" }}>
              취소
            </Button>
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
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          작업장 마스터
        </Typography>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            checkboxSelection
            autoHeight={false}
            rowHeight={38}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f2e8e8",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000",
                fontWeight: "bold",
              },
              border: 0,
              minWidth: "1100px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
