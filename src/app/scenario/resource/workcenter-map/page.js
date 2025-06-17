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
  { field: "id", headerName: "순번", flex: 1 },
  { field: "siteId", headerName: "플랜트", flex: 1 },
  { field: "routingId", headerName: "Routing 코드", flex: 1 },
  { field: "partId", headerName: "품목코드", flex: 1 },
  { field: "operationId", headerName: "공정 코드", flex: 1 },
  { field: "routingGroup", headerName: "Routing그룹", flex: 1 },
  { field: "routingVersion", headerName: "Routing버전", flex: 1 },
  { field: "workcenterId", headerName: "작업장코드", flex: 1 },
  { field: "tactTime", headerName: "생산간격", flex: 1 },
  { field: "tactTimeUom", headerName: "생산간격단위", flex: 1 },
  { field: "procTime", headerName: "Unit당 생산시간", width: 110 },
  { field: "procTimeUom", headerName: "Unit당 생산 시간 단위", width: 120 },
  { field: "scenarioId", headerName: "시나리오", flex: 1 },
];

export default function WorkCenterMap() {
  const scenarioId = useScenarioStore((state) => state.selectedScenarioId);
  const setScenarioId = useScenarioStore(
    (state) => state.setSelectedScenarioId
  );

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (!scenarioId) setScenarioId("S010000");
  }, [scenarioId, setScenarioId]);

  const fetchData = (id) => {
    const url = id
      ? `http://localhost:8080/api/scenarios/resource/workcentermap/${id}`
      : `http://localhost:8080/api/scenarios/resource/workcentermap`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = data.workcenterMaps || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.siteId || "",
          routingId: item.routingId || "",
          partId: item.partId || "",
          operationId: item.workCenterMapId?.operationId || "",
          workcenterId: item.workCenterMapId?.workcenterId || "",
          scenarioId: item.workCenterMapId?.scenarioId || "",
          routingGroup: item.routingGroup || "",
          routingVersion: item.routingVersion || "",
          tactTime: item.tactTime || "",
          tactTimeUom: item.tactTimeUom || "",
          procTime: item.procTime || "",
          procTimeUom: item.procTimeUom || "",
        }));
        setRows(formatted);
      })
      .catch((err) => console.error("fetchData 오류:", err));
  };

  useEffect(() => {
    if (scenarioId) fetchData(scenarioId);
  }, [scenarioId]);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (scenarioId) formData.append("scenarioId", scenarioId);

    fetch("http://localhost:8080/api/scenarios/resource/workcentermap-upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          fetchData(scenarioId);
        } else {
          console.error("업로드 실패");
        }
      })
      .finally(() => handleCloseDialog());
  };

  const handleDownload = () => {
    window.open(
      `http://localhost:8080/api/scenarios/resource/workcentermap-download?scenarioId=${scenarioId}`,
      "_blank"
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownload} />

        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            생산-라우팅 맵 파일 업로드
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
          생산 라우팅
        </Typography>

        {/* 안쪽 스크롤 전용 */}
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
              border: 0,
              minWidth: "1100px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
