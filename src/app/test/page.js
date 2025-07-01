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
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

export default function ForecastPanel() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("In Use");
  const [selectedDate, setSelectedDate] = useState("2224-02-01");

  const dummyData = [
    { month: "03", value: 8000 },
    { month: "04", value: 9000 },
    { month: "05", value: 7200 },
    { month: "06", value: 7400 },
    { month: "07", value: 6000 },
    { month: "08", value: 4600 },
    { month: "09", value: 5000 },
    { month: "10", value: 4700 },
    { month: "11", value: 4900 },
    { month: "02", value: 4400 },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: "#fcf7f3", height: "100%" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        수요예측
      </Typography>

      {/* 필터 영역 */}
      <Stack direction="row" spacing={2} mb={2}>
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            size="small"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="In Use">In Use</MenuItem>
            <MenuItem value="Ves">Ves</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
            size="small"
          >
            <MenuItem value="In Use">In Use</MenuItem>
            <MenuItem value="Unused">Unused</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          size="small"
        />

        <Button variant="contained" sx={{ backgroundColor: "#cbb8a9" }}>
          Search
        </Button>
      </Stack>

      {/* 예측 테이블 */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box component="table" width="100%" sx={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {['Status', 'Category', 'Name', 'Color', 'Gender'].map((head, idx) => (
                <th key={idx} style={{ textAlign: "left", padding: 8 }}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["SOCKS", "DRESS", "Au Than top1 dren a", "SHIRT"].map((name, i) => (
              <tr key={i}>
                <td style={{ padding: 8 }}>✔ Check</td>
                <td style={{ padding: 8 }}>{i === 0 ? "All" : i === 1 ? "In Use" : i === 2 ? "Ves" : ""}</td>
                <td style={{ padding: 8 }}>{name}</td>
                <td style={{ padding: 8 }}>{i === 1 ? "Blue" : i === 3 ? "White" : "N/A"}</td>
                <td style={{ padding: 8 }}>Male</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Paper>

      {/* 차트 및 요약 박스 */}
      <Stack direction="row" spacing={2}>
        <Box flex={3} sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6e4f3a" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <Typography mt={2} align="center" fontWeight="bold">
            총 판매수량 69,437
          </Typography>
        </Box>

        <Box flex={1} sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
          <Typography>총 판매수량: 69,437</Typography>
          <Typography>예측수량: 61,019</Typography>
          <Typography>MAPE: 4.7%</Typography>
          <Typography>최대 오차: 4,613</Typography>
        </Box>
      </Stack>
    </Box>
  );
}