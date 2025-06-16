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

const columns = [
  { field: "id", headerName: "순번", width: 80 },
  { field: "scenarioId", headerName: "시나리오", width: 120 },
  { field: "routingId", headerName: "라우팅 코드", width: 130 },
  { field: "siteId", headerName: "플랜트", width: 150 },
  { field: "routingName", headerName: "라우팅명", width: 150 },
  { field: "routingType", headerName: "라우팅 타입", width: 120 },
];

export default function DataGridSection() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [selected, setSelectedFile] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const fetchRoutingData = () => {
    fetch("http://localhost:8080/api/scenarios/bop/routing")
      .then((res) => res.json())
      .then((data) => {
        const list = data.routings || [];

        const formatted = list.map((item, index) => ({
          id: index + 1,
          scenarioId: item.routingId?.scenarioId,
          routingId: item.routingId?.routingId || "",
          siteId: item.routingId?.siteId || "",
          routingName: item.routingName,
          routingType: item.routingType,
        }));

        setRows(formatted);
      });
  };

  useEffect(() => {
    fetchRoutingData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file); // 또는 별도 버튼으로 업로드
      setOpen(false);
    }
  };

  const handleUpload = (file) => {
    console.log("!!!");
    //파일 백으로 보내고, 응답받아서
    //파일 보내고자 할때는 보내고자 하는 파일을 FormData 객체를 이용해서 전송, header 설정은 할 필요 없음( 더 복잡해짐)
    const formData = new FormData();
    formData.append("file", file);
    fetch("http://localhost:8080/api/scenarios/bop/routing-upload", {
      method: "post",
      body: formData,
    }).then((response) => {
      if (response.status === 200) fetchRoutingData();
      else console.error("업로드 실패");
    });
  };

  const handleDownloadExcel = () => {
    window.location.href =
      "http://localhost:8080/api/scenarios/bop/routing-download";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 툴바 */}
      <Box sx={{ mt: 2 }}>
        <Toolbar upload={handleOpenDialog} download={handleDownloadExcel} />

        {/* 업로드 Dialog */}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            파일 업로드
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
              onClick={() => document.getElementById("file-input").click()}
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

      <Box p={2} sx={{ width: "fit-content", maxWidth: "100%" }}>
        <Typography variant="h6" gutterBottom>
          생산 라우팅 목록
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          autoHeight // ⬅ 높이를 내용에 맞게 자동 조정
          sx={{
            border: 0,
            minWidth: "500px", // 너무 작게 줄어드는 걸 방지
          }}
          rowHeight={38}
        />
      </Box>
    </Box>
  );
}
