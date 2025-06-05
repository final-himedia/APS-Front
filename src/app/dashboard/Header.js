// components/Header.js
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Popover,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Header() {
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleCalendarClick = (event) => {
    setCalendarAnchor(event.currentTarget);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // TODO: 다크모드 토글 기능 연결 필요
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      color="default"
      sx={{ borderBottom: "1px solid #ccc" }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <IconButton>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleDarkModeToggle}>
          <DarkModeIcon color={darkMode ? "primary" : "inherit"} />
        </IconButton>
        <IconButton onClick={handleCalendarClick}>
          <CalendarTodayIcon />
        </IconButton>

        <Popover
          open={Boolean(calendarAnchor)}
          anchorEl={calendarAnchor}
          onClose={() => setCalendarAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Box sx={{ p: 2 }}>📅 여기에 캘린더 컴포넌트 넣으세요</Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
