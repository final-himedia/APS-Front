"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";

// 더미 데이터
const operations = [
  {
    group: "LPT ROTOR ASSEMBLY",
    steps: [
      {
        id: "LRA_0010",
        part: "POCFLPT41",
        name: "020",
        start: "2025-01-23",
        end: "2025-01-25",
      },
      {
        id: "LRA_0020",
        part: "POCFLPT41",
        name: "020",
        start: "2025-01-24",
        end: "2025-01-26",
      },
    ],
  },
];

const dateRange = Array.from({ length: 25 }, (_, i) =>
  dayjs("2025-01-15").add(i, "day").format("MM/DD")
);

export default function ProductionGantt() {
  const [scenario, setScenario] = useState("S0100000");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2 }}>
      {/* 상단 필터 */}
      <Paper
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>시나리오</InputLabel>
            <Select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              label="시나리오"
            >
              <MenuItem value="S0100000">S0100000</MenuItem>
              <MenuItem value="S0200000">S0200000</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="시작 날짜"
            size="small"
            type="date"
            defaultValue="2025-01-15"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="종료 날짜"
            size="small"
            type="date"
            defaultValue="2025-02-08"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="model-select-label">기종/호기</InputLabel>
            <Select
              labelId="model-select-label" // ✅ InputLabel과 연결
              label="기종/호기" // ✅ 꼭 있어야 함! 없으면 label floating 안됨
              defaultValue="F404"
            >
              <MenuItem value="F404">F404 [10020250]</MenuItem>
              <MenuItem value="F100">F100 [12345678]</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="화살표"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="트리 열기/닫기"
          />

          {/* 정렬 + 버튼 그룹 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel control={<Switch />} label="정렬" />
            <Button variant="outlined" startIcon={<SearchIcon />} size="small">
              검색
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} size="small">
              초기화
            </Button>
            <Button variant="outlined" startIcon={<SaveIcon />} size="small">
              저장
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* 간트 영역 */}
      <Paper sx={{ display: "flex", overflowX: "auto", height: 400 }}>
        {/* 왼쪽 테이블 */}
        <Box
          sx={{
            minWidth: 250,
            borderRight: "1px solid #ddd",
            bgcolor: "#f9f9f9",
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              display: "flex",
              fontWeight: "bold",
              px: 1,
              py: 1,
              borderBottom: "1px solid #ccc",
              fontSize: 13,
            }}
          >
            <Box sx={{ width: "40%" }}>구분 (operationName)</Box>
            <Box sx={{ width: "30%" }}>공정ID (operationdid)</Box>
            <Box sx={{ width: "30%" }}>자재 (partid)</Box>
          </Box>
          {/* 데이터 */}
          {operations.map((group) => (
            <Box key={group.group}>
              {group.steps.map((step, index) => (
                <Box
                  key={step.id}
                  sx={{ display: "flex", px: 1, py: 0.5, fontSize: 12 }}
                >
                  {index === 0 && (
                    <Box sx={{ width: "40%" }} rowSpan={group.steps.length}>
                      {group.group}
                    </Box>
                  )}
                  <Box sx={{ width: "30%" }}>{step.id}</Box>
                  <Box sx={{ width: "30%" }}>{step.part}</Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        {/* 간트 바 영역 */}
        <Box sx={{ minWidth: 1000 }}>
          {/* 날짜 헤더 */}
          <Box
            sx={{
              display: "flex",
              borderBottom: "1px solid #ccc",
              bgcolor: "#eee",
            }}
          >
            {dateRange.map((date) => (
              <Box
                key={date}
                sx={{
                  width: 80,
                  textAlign: "center",
                  py: 1,
                  borderRight: "1px solid #ddd",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {date}
              </Box>
            ))}
          </Box>
          {/* 각 작업 바 */}
          {operations.map((group) =>
            group.steps.map((step) => {
              const startIdx = dayjs(step.start).diff("2025-01-15", "day");
              const span = dayjs(step.end).diff(dayjs(step.start), "day") + 1;
              return (
                <Box key={step.id} sx={{ display: "flex", height: 36 }}>
                  {dateRange.map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 80,
                        borderRight: "1px solid #eee",
                        position: "relative",
                      }}
                    >
                      {i === startIdx && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 4,
                            height: 28,
                            width: `${span * 80}px`,
                            bgcolor: "#a6d4fa",
                            borderRadius: 1,
                            fontSize: 12,
                            px: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {step.name}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              );
            })
          )}
        </Box>
      </Paper>
    </Box>
  );
}
