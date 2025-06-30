"use client";

import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function FilterToolbar() {
  const [scenario, setScenario] = useState("S020000");
  const [startDate, setStartDate] = useState("100202501_01");

  const handleSearch = () => {
    console.log("조회됨:", { scenario, startDate });
  };

  const data = [
    { name: "완료", value: 71 },
    { name: "진행 중", value: 1 },
    { name: "미진행", value: 23 },
  ];

  const COLORS = ["#3f51b5", "#ff7f7f", "#fbc02d"];

  return (
    <>
      {/* 필터 바 */}
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
            <MenuItem value="S020000">S020000</MenuItem>
            <MenuItem value="S010000">S010000</MenuItem>
          </TextField>

          <TextField
            label="호기"
            select
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="100202501_01">100202501_01</MenuItem>
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

      {/* 콘텐츠 카드 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {[0, 1].map((rowIndex) => (
          <Box key={rowIndex} sx={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map((colIndex) => {
              const isTargetBox = rowIndex === 0 && colIndex === 1;

              return (
                <Box
                  key={colIndex}
                  sx={{
                    flex: 1,
                    minWidth: 230,
                    height: 320,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    p: 2,
                    overflow: "hidden",
                  }}
                >
                  {isTargetBox && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          labelLine={true}
                          label={({ name }) => name}
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={30} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </>
  );
}
