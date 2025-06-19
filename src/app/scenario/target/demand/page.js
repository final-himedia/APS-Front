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
  { field: "id", headerName: "순번", width: 20 },
  { field: "demandId", headerName: "판매오더번호", width: 90 },
  { field: "siteId", headerName: "플랜트", width: 60 },
  { field: "partId", headerName: "품목코드", width: 70 },
  { field: "partName", headerName: "품목명", flex: 1 },
  { field: "customerId", headerName: "고객사", flex: 1 },
  { field: "dueDate", headerName: "납기일", flex: 1 },
  { field: "demandQty", headerName: "주문수량", width: 70 },
  { field: "priority", headerName: "우선순위", width: 70 },
  { field: "uom", headerName: "단위", width: 20 },
  { field: "orderType", headerName: "주문유형", width: 70 },
  { field: "orderTypeName", headerName: "주문유형내역", width: 90 },
  { field: "exceptYn", headerName: "제외주문", width: 70 },
  { field: "headerCreationDate", headerName: "오더생성일", width: 90 },
  { field: "hasOverActQty", headerName: "초과실적보유주문FLAG", flex: 1 },
  { field: "scenarioId", headerName: "시나리오", width: 70 },
];

export default function Demand() {
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
    const url = `http://localhost:8080/api/scenarios/target/demand/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
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
          hasOverActQty: item.hasOverActQty || "",
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

    fetch("http://localhost:8080/api/scenarios/target/demand-upload", {
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
      `http://localhost:8080/api/scenarios/target/demand-download?scenarioId=${scenarioId}`,
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
            판매오더 파일 업로드
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
          판매 오더
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
              // 헤더 전체 행 배경(임시)
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f2e8e8",
              },

              // 각 헤더 셀에 배경, 텍스트색 적용
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f2e8e8",
                color: "#000", // 글자 색
                fontWeight: "bold", // 글자 두껍게
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
