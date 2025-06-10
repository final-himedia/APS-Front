"use client";

import { Typography, Box } from "@mui/material";

export default function ResultPage() {
  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        실행 결과 분석
      </Typography>
      {/* 여기에 차트나 테이블, 필터 등 분석 콘텐츠 삽입 */}
    </Box>
  );
}
