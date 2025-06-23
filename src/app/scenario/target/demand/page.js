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
  { field: "id", headerName: "순번", width: 40 },
  { field: "demandId", headerName: "판매오더번호", width: 100 },
  { field: "siteId", headerName: "플랜트", width: 60 },
  { field: "partId", headerName: "품목코드", width: 70 },
  { field: "partName", headerName: "품목명", flex: 1 },
  { field: "customerId", headerName: "고객사", flex: 1 },
  { field: "dueDate", headerName: "납기일", flex: 1 },
  { field: "demandQty", headerName: "주문수량", width: 70 },
  { field: "priority", headerName: "우선순위", width: 70 },
  { field: "uom", headerName: "단위", width: 40 },
  { field: "orderType", headerName: "주문유형", width: 70 },
  { field: "orderTypeName", headerName: "주문유형내역", width: 100 },
  { field: "exceptYn", headerName: "제외주문", width: 70 },
  { field: "headerCreationDate", headerName: "오더생성일", width: 90 },
  { field: "hasOverActQty", headerName: "초과실적보유", width: 100 },
  { field: "scenarioId", headerName: "시나리오", width: 80 },
];

export default function DemandView() {
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

  const fetchData = async (token, id) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/scenarios/target/demand/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const list = data.demands || [];
      const formatted = list.map((item, index) => ({
        id: index + 1,
        demandId: item.demandId?.demandId || "",
        siteId: item.demandId?.siteId || "",
        partId: item.demandId?.partId || "",
        scenarioId: item.demandId?.scenarioId || "",
        partName: item.partName || "",
        customerId: item.customerId || "",
        dueDate: item.dueDate || "",
        demandQty: item.demandQty || "",
        priority: item.priority || "",
        uom: item.uom || "",
        orderType: item.orderType || "",
        orderTypeName: item.orderTypeName || "",
        exceptYn: item.exceptYn || "",
        headerCreationDate: item.headerCreationDate || "",
        hasOverActQty: item.hasOverActQty ?? false,
      }));
      setRows(formatted);
    } catch (err) {
      console.error("판매오더 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    if (token && scenarioId) fetchData(token, scenarioId);
  }, [token, scenarioId]);

  const handleDownloadExcel = async () => {
    if (!token || !scenarioId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/scenarios/target/demand-download?scenarioId=${scenarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("다운로드 실패");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `demand_${scenarioId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("다운로드 에러:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scenarioId", scenarioId);

    fetch("http://localhost:8080/api/scenarios/target/demand-upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        if (res.ok) fetchData(token, scenarioId);
        else throw new Error("업로드 실패");
      })
      .catch(console.error)
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
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
            판매오더 업로드
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
                등록할 파일을 선택해주세요
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
        }}
      >
        <Typography variant="h6" gutterBottom>
          판매오더
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
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f2e8e8" },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000",
                fontWeight: "bold",
              },
              border: 0,
              minWidth: "1200px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
