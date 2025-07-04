"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardCharts() {
  const [scenario, setScenario] = useState("S010000");
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchChartData = async (scenarioId) => {
    try {
      const [barRes, pieRes] = await Promise.all([
        fetch(
          `http://15.164.98.31:8080/api/execution/top5-operation?scenarioId=${scenarioId}`
        ),
        fetch(
          `http://15.164.98.31:8080/api/execution/total-time-routing?scenarioId=${scenarioId}`
        ),
      ]);

      if (!barRes.ok) throw new Error("Top 5 작업량 응답 실패");
      if (!pieRes.ok) throw new Error("Routing 시간 응답 실패");

      const barJson = await barRes.json();
      const pieJson = await pieRes.json();

      console.log("📦 barJson:", barJson);
      console.log("📦 pieJson:", pieJson);

      const barFormatted = barJson.map((item) => ({
        name: item.operationId || "알 수 없음",
        value: item.durationMinutes || 0,
      }));

      const pieFormatted = pieJson.map((item) => ({
        name: item.routingId || "미정 라우팅",
        value: item.totalDurationMinutes || 0,
      }));

      setBarData(barFormatted);
      setPieData(pieFormatted);
    } catch (err) {
      console.error("🔥 데이터 불러오기 실패:", err.message);
    }
  };

  useEffect(() => {
    fetchChartData(scenario);
  }, [scenario]);

  const handleSearch = () => {
    fetchChartData(scenario);
  };

  const maxBarValue = Math.max(...barData.map((d) => d.value), 0);

  // 파이차트 색상: 많은 값부터 진하게
  const sortedPie = [...pieData].sort((a, b) => b.value - a.value);
  const pieColorSteps = [
    "#c39696",
    "#d7a6a6",
    "#e2bdbd",
    "#f2d6d6",
    "#f8e4e4",
    "#f9f1f1",
    "#f4f4f4",
    "#ededed",
    "#e5e5e5",
    "#dddddd",
    "#d5d5d5",
    "#cdcdcd",
  ];

  return (
    <>
      {/* 필터바 */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f8eded",
          border: "1px solid #e0dcdc",
          borderRadius: 2,
          px: 2,
          py: 1.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="시나리오"
            select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="S010000">S010000</MenuItem>
          </TextField>
        </Stack>

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: "#3f3f3f",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#2c2c2c",
            },
          }}
        >
          조회
        </Button>
      </Box>

      {/* 차트 영역 */}
      <Box sx={{ display: "flex", gap: 2, height: 700, mt: 1 }}>
        {/* 왼쪽: 막대그래프 */}
        <Box
          sx={{
            resize: "horizontal",
            overflow: "auto",
            minWidth: 250,
            maxWidth: "70%",
            width: "50%",
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={4}>
            Top 5 작업량
          </Typography>

          {barData.length === 0 ? (
            <Typography color="textSecondary">데이터가 없습니다.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height="75%">
              <BarChart
                layout="vertical"
                data={barData}
                margin={{ top: 20, bottom: 20, left: 40 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Bar dataKey="value" barSize={50}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value === maxBarValue ? "#c39696" : "#d7d7d7"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* 오른쪽: 파이차트 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            p: 2,
            overflow: "hidden",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            공정별 시간 데이터
          </Typography>

          {pieData.length === 0 ? (
            <Typography color="textSecondary">데이터가 없습니다.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={sortedPie}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={170}
                  label={({ name }) =>
                    name.length > 15 ? name.slice(0, 12) + "..." : name
                  }
                >
                  {sortedPie.map((entry, index) => {
                    const color =
                      pieColorSteps[index % pieColorSteps.length] || "#e0e0e0";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={80}
                  wrapperStyle={{ marginTop: -30 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </>
  );
}
