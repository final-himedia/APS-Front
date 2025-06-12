"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ListDivider from "./standard/ListDivider";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { Box, Typography } from "@mui/material";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 로그인 페이지는 고정 레이아웃 없이 바로 렌더링
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = 250;

  const [currentTime, setCurrentTime] = useState("");

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

    updateTime();
    const interval = setInterval(updateTime, 60000);

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

      {/* 메인 영역 */}
      <div
        style={{
          marginLeft: isSidebarOpen ? sidebarWidth : 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 상단바 */}
        <div
          style={{
            height: 45,
            backgroundColor: "#fff",
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            left: isSidebarOpen ? sidebarWidth : 0,
            zIndex: 1200,
          }}
        >
          {/* 사이드바 열기 버튼 */}
          {!isSidebarOpen && (
            <IconButton onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* 사용자 정보 */}
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

        {/* 페이지 콘텐츠 */}
        <main
          style={{
            padding: "16px",
            height: "calc(100vh - 45px)",
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
