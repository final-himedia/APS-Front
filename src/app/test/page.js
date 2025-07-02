"use client";

import {
  Box,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Paper,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

export default function ForecastPanel() {
  const [forecastData, setForecastData] = useState([]);
  const [forecastTable, setForecastTable] = useState([]);
  const [rawForecastTable, setRawForecastTable] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 69437,
    forecastTotal: 0,
    mape: 4.7,
    maxError: 0,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [startDate, setStartDate] = useState("2017-03-01");
  const [endDate, setEndDate] = useState("2020-04-30");
  const [file, setFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const fetchForecast = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/predict");
      const json = await res.json();

      const formatted = json.map((item) => ({
        ds: item.ds.slice(0, 10),
        month: item.ds.slice(5, 7),
        yhat: Math.round(item.yhat),
        yhat_lower: Math.round(item.yhat_lower),
        yhat_upper: Math.round(item.yhat_upper),
      }));

      setRawForecastTable(formatted);
      setForecastTable(formatted);
      setForecastData(formatted.map((d) => ({ month: d.month, yhat: d.yhat })));

      const total = formatted.reduce((sum, d) => sum + d.yhat, 0);
      const maxError = Math.max(
        ...formatted.map((d) => d.yhat_upper - d.yhat_lower)
      );

      setSummary((prev) => ({ ...prev, forecastTotal: total, maxError }));
    } catch (err) {
      console.error("❌ 예측 실패:", err.message);
    }
  };

  const handleSearch = () => {
    const filtered = rawForecastTable.filter(
      (row) => row.ds >= startDate && row.ds <= endDate
    );

    const chartData = filtered.map((d) => ({
      month: d.ds.slice(5, 7),
      yhat: d.yhat,
    }));
    const total = chartData.reduce((sum, d) => sum + d.yhat, 0);
    const maxError = Math.max(
      ...filtered.map((d) => d.yhat_upper - d.yhat_lower)
    );

    setForecastTable(filtered);
    setForecastData(chartData);
    setSummary((prev) => ({ ...prev, forecastTotal: total, maxError }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload-file", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("업로드 실패");
      const result = await res.json();
      alert(result.message);
      setFile(null);
      await fetchForecast();
    } catch (err) {
      alert("업로드 중 오류 발생");
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const pagedRows = forecastTable.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 2, backgroundColor: "#f2e8e8" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        수요예측
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        mb={2}
        alignItems="center"
        flexWrap="wrap"
      >
        <TextField
          type="date"
          label="시작일"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="종료일"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#c39696" }}
          onClick={handleSearch}
        >
          검색
        </Button>
        <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file}
          size="small"
          sx={{ backgroundColor: file ? "#c39696" : undefined }}
        >
          업로드
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={2}>
        <Box flex={3} sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton
              onClick={() => setOpenDialog(true)}
              size="small"
              sx={{ fontSize: 18, padding: 0.5 }}
            >
              <OpenInFullIcon fontSize="inherit" />
            </IconButton>
          </Box>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={forecastData}
              margin={{ top: 30, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{ value: "월", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{
                  value: "수요량",
                  position: "insideLeft",
                  offset: 0,
                  dx: 60,
                  dy: -110,
                  style: { textAnchor: "middle", fontSize: 14 },
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="yhat"
                stroke="#6e4f3a"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <Typography mt={0.5} align="center" fontWeight="bold">
            총 판매 수익 {summary.totalSales.toLocaleString()}
          </Typography>
        </Box>
        <Box flex={1} sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
          <Typography>
            총 판매 수익: {summary.totalSales.toLocaleString()}
          </Typography>
          <Typography>
            총 예측 수요량: {summary.forecastTotal.toLocaleString()}
          </Typography>
          <Typography>평균 예측 오차율(MAPE): {summary.mape}%</Typography>
          <Typography>
            최대 예측 오차: {summary.maxError.toLocaleString()}
          </Typography>
        </Box>
      </Stack>

      {forecastTable.length > 0 && (
        <Paper variant="outlined" sx={{ p: 1, mt: 0.5 }}>
          <Typography fontWeight="bold" mb={0}>
            예측 상세표
          </Typography>
          <Box
            component="table"
            width="100%"
            sx={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {["날짜", "예측값 (yhat)", "최소값", "최대값", "오차 범위"].map(
                  (h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: 8 }}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: 8 }}>{row.ds}</td>
                  <td style={{ padding: 8 }}>{row.yhat.toLocaleString()}</td>
                  <td style={{ padding: 8 }}>
                    {row.yhat_lower.toLocaleString()}
                  </td>
                  <td style={{ padding: 8 }}>
                    {row.yhat_upper.toLocaleString()}
                  </td>
                  <td style={{ padding: 8 }}>
                    {(row.yhat_upper - row.yhat_lower).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Box>
          <TablePagination
            component="div"
            count={forecastTable.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </Paper>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>예측 차트 전체 보기</DialogTitle>
        <DialogContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={forecastData}
              margin={{ top: 30, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{ value: "월", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{
                  value: "수요량",
                  position: "insideLeft",
                  offset: 0,
                  dx: 100,
                  dy: -110,
                  style: { textAnchor: "middle", fontSize: 14 },
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="yhat"
                stroke="#6e4f3a"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
