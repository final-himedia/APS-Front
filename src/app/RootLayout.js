"use client";

import { usePathname, useRouter } from "next/navigation";
import ListDivider from "./standard/ListDivider";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconButton from "@mui/material/IconButton";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = 250;
  const [currentTime, setCurrentTime] = useState("");

  // 드롭다운 메뉴 상태
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePasswordChange = () => {
    handleMenuClose();
    router.push("/management/user/change-password"); // ✅ 여기에 경로 반영
  };

  const handleLogout = () => {
    handleMenuClose();
    if (user?.id && pathname && pathname !== "/login") {
      localStorage.setItem(`lastPath_${user.id}`, pathname);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // localStorage에서 사용자 정보 읽기
  const userData =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userData ? JSON.parse(userData) : null;

  // 현재 경로가 로그인 페이지가 아니면 유저별 lastPath 저장
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

            <IconButton onClick={handleMenuOpen}>
              <ArrowDropDownIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handlePasswordChange}>
                <LockResetIcon fontSize="small" sx={{ mr: 1 }} />
                비밀번호 변경
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                로그아웃
              </MenuItem>
            </Menu>
          </Box>
        </div>

        <main
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            height: "calc(100vh - 45px)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
