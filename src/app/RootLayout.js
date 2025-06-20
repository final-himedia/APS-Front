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

  // 1. 현재 경로가 로그인 페이지가 아니면 유저별 lastPath 저장
  useEffect(() => {
    if (user?.id && pathname && pathname !== "/login") {
      localStorage.setItem(`lastPath_${user.id}`, pathname);
    }
  }, [pathname, user]);

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
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 로그아웃 핸들러 - 로그아웃 전에 유저별 lastPath 저장, 그리고 토큰, 유저 정보 삭제
  const handleLogout = () => {
    if (user?.id && pathname && pathname !== "/login") {
      localStorage.setItem(`lastPath_${user.id}`, pathname);
    }

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
            backgroundColor: "#ffffff",
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
                {user?.name}
              </Typography>
              <Typography variant="caption">{user?.email}</Typography>
            </div>
            <Typography variant="caption">{currentTime}</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "#555555",
                borderColor: "#cccccc",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#999999",
                  backgroundColor: "#f0f0f0",
                },
                minWidth: 80,
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
