"use client";

import { usePathname, useRouter } from "next/navigation";
import ListDivider from "./standard/ListDivider";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = 250;
  const [currentTime, setCurrentTime] = useState("");

  // localStorage에서 사용자 정보 읽기
  const userData =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userData ? JSON.parse(userData) : null;

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

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login"); // 로그인 페이지로 이동
  };

  // 로그인 페이지는 레이아웃 없이 children만 렌더링
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
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
      <div
        style={{
          marginLeft: isSidebarOpen ? sidebarWidth : 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 45,
            backgroundColor: "#939393",
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            left: isSidebarOpen ? sidebarWidth : 0,
            zIndex: 1200,
          }}
        >
          {!isSidebarOpen && (
            <IconButton onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

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
                {user?.name || "익명 사용자"}
              </Typography>
              <Typography variant="caption">
                {user?.email || "이메일 없음"}
              </Typography>
            </div>
            <Typography variant="caption">{currentTime}</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "#555555", // 연한 진한 회색 텍스트
                borderColor: "#cccccc", // 옅은 테두리
                textTransform: "none", // 기본 대문자 변환 해제 (필요 시)
                "&:hover": {
                  borderColor: "#999999",
                  backgroundColor: "#f0f0f0", // 마우스 오버시 연한 회색 배경
                },
                minWidth: 80, // 버튼 크기 조절 (필요 시)
              }}
            >
              로그아웃
            </Button>
          </Box>
        </div>

        <main
          style={{
            paddingLeft: 0,
            paddingRight: 16,
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
