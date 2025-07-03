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
  { field: "id", headerName: "순번", width: 50 },
  { field: "siteId", headerName: "플랜트", width: 60 },
  { field: "operationId", headerName: "공정 코드", width: 80 },
  { field: "routingId", headerName: "ROUTING 코드", flex: 1 },
  { field: "operationSeq", headerName: "공정 순서", width: 80 },
  { field: "operationName", headerName: "공정 명", flex: 1 },
  { field: "runTime", headerName: "공정 실행 시간", flex: 1 },
  { field: "yield", headerName: "공정 수율", width: 80 },
  { field: "runTimeUom", headerName: "실행 시간 단위", flex: 1 },
  { field: "operationType", headerName: "공정 유형", width: 80 },
  { field: "waitTimeUom", headerName: "대기시간 단위", flex: 1 },
  { field: "transferTimeUom", headerName: "이동시간 단위", flex: 1 },
  { field: "scenarioId", headerName: "시나리오", width: 80 },
  { field: "sourcingType", headerName: "sourcingType", flex: 1 },
];

export default function OperationMasterView() {
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
    console.log("토큰:", storedToken);
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!scenarioId) setScenarioId("S010000");
  }, [scenarioId, setScenarioId]);

  const fetchOperationData = (token, id) => {
    if (!token || !id) return;
    fetch(`15.164.98.31:8080/api/scenarios/bop/operationRoute/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = data.operationRoute || [];
        const formatted = list.map((item, index) => ({
          id: index + 1,
          siteId: item.id?.siteId,
          operationId: item.id?.operationId,
          routingId: item.id?.routingId,
          scenarioId: item.id?.scenarioId,
          operationName: item.operationName,
          runTime: item.runTime,
          yield: item.yield,
          runTimeUom: item.runTimeUom,
          operationType: item.operationType,
          waitTimeUom: item.waitTimeUom,
          transferTimeUom: item.transferTimeUom,
          sourcingType: item.sourcingType,
          operationSeq: item.operationSeq,
        }));

        setRows(formatted);
      })
      .catch((err) => console.error("공정 데이터 가져오기 실패:", err));
  };

  useEffect(() => {
    if (scenarioId && token) fetchOperationData(token, scenarioId);
  }, [scenarioId, token]);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !token || !scenarioId) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("scenarioId", scenarioId);

    fetch("15.164.98.31:8080/api/scenarios/bop/operationRoute-upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) fetchOperationData(token, scenarioId);
        else console.error("업로드 실패");
      })
      .finally(() => setOpen(false));
  };

  const handleDownloadExcel = () => {
    if (!token || !scenarioId) return;

    fetch(
      `15.164.98.31:8080/api/scenarios/bop/operationRoute-download?scenarioId=${scenarioId}`,
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
        link.setAttribute("download", "operation-route.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => console.error("다운로드 중 오류:", err));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownloadExcel} />
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            공정 마스터 파일 업로드
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
          공정 마스터
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
              border: 0,
              minWidth: "1500px",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f2e8e8",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
