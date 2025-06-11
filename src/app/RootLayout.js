"use client";

import { useState, useEffect } from "react";
import ListDivider from "./standard/ListDivider";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { Box, Typography } from "@mui/material";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isInputSidebarOpen, setInputSidebarOpen] = useState(true);

  const sidebarWidth = 250;

  // 현재 시간 상태
  const [currentTime, setCurrentTime] = useState("");

  // 시간 갱신
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    updateTime(); // 초기 호출
    const interval = setInterval(updateTime, 60000); // 1분마다 갱신

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 사이드바 */}
      {isSidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: sidebarWidth,
            height: "100vh",
            backgroundColor: "#fff",
            borderRight: "1px solid #ccc",
            zIndex: 1100,
          }}
        >
          <ListDivider onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div style={{ marginLeft: isSidebarOpen ? sidebarWidth : 0, flex: 1 }}>
        {/* 상단바 */}
        <div
          style={{
            height: 45,
            backgroundColor: "#fff",
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            position: "fixed",
            top: 0,
            left: isSidebarOpen ? sidebarWidth : 0,
            right: 0,
            zIndex: 1200,
          }}
        >
          {/* 메뉴 아이콘 */}
          {!isSidebarOpen && (
            <IconButton onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* 오른쪽 사용자 정보 */}
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div style={{ textAlign: "right" }}>
              <Typography variant="body2" fontWeight="bold">
                남주현
              </Typography>
              <Typography variant="caption">himedia717@naver.com</Typography>
            </div>
            <Typography variant="caption">{currentTime}</Typography>
          </Box>
        </div>

        {/* 페이지 내용 */}
        <main style={{ marginTop: 40, padding: 16 }}>{children}</main>
      </div>
    </div>
  );
}
