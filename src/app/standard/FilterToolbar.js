"use client";

import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useState } from "react";

export default function FilterToolbar() {
  const [scenario, setScenario] = useState("S020000");
  const [startDate, setStartDate] = useState("100202501_01");

  const handleSearch = () => {
    console.log("조회됨:", { scenario, startDate });
  };

  return (
    <>
      {/* 🔍 필터 바 */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f8eded",
          border: "1px solid #e0dcdc",
          borderRadius: 2,
          px: 2,
          py: 1.5,
          mb: 4,
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
            label="초기일자"
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

      {/* 🔽 콘텐츠 카드 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {[0, 1].map((rowIndex) => (
          <Box key={rowIndex} sx={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map((colIndex) => (
              <Box
                key={colIndex}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  aspectRatio: "4 / 3",
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </>
  );
}
