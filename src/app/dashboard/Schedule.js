// dashboard/Schedule.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getStartDayIndex(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

export default function Schedule() {
  const today = new Date();
  const [yearMonth, setYearMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [inputText, setInputText] = useState("");

  const onPrevMonth = () => {
    let { year, month } = yearMonth;
    if (month === 1) {
      year -= 1;
      month = 12;
    } else {
      month -= 1;
    }
    if (
      year < today.getFullYear() - 1 ||
      (year === today.getFullYear() - 1 && month < today.getMonth() + 1)
    )
      return;
    setYearMonth({ year, month });
    setSelectedDate(null);
  };

  const onNextMonth = () => {
    let { year, month } = yearMonth;
    if (month === 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
    if (
      year > today.getFullYear() + 1 ||
      (year === today.getFullYear() + 1 && month > today.getMonth() + 1)
    )
      return;
    setYearMonth({ year, month });
    setSelectedDate(null);
  };

  const { year, month } = yearMonth;
  const daysInMonth = getDaysInMonth(year, month);
  const startDayIndex = getStartDayIndex(year, month);

  const onDateClick = (date) => {
    setSelectedDate(date);
    setInputText("");
  };

  const addSchedule = () => {
    if (!selectedDate || !inputText.trim()) return;
    const key = `${year}-${month}-${selectedDate}`;
    setSchedule((prev) => {
      const prevList = prev[key] || [];
      return { ...prev, [key]: [...prevList, inputText.trim()] };
    });
    setInputText("");
  };

  return (
    <Box sx={{ p: 2, maxWidth: 700, margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton
          onClick={onPrevMonth}
          disabled={
            year < today.getFullYear() - 1 ||
            (year === today.getFullYear() - 1 && month <= today.getMonth() + 1)
          }
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography variant="h5" fontWeight="bold">
          {year}년 {month}월
        </Typography>

        <IconButton
          onClick={onNextMonth}
          disabled={
            year > today.getFullYear() + 1 ||
            (year === today.getFullYear() + 1 && month >= today.getMonth() + 1)
          }
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Grid container>
        {daysOfWeek.map((d) => (
          <Grid key={d} item xs={12 / 7}>
            <Box textAlign="center" fontWeight="bold">
              {d}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1}>
        {Array.from({ length: startDayIndex }, (_, i) => (
          <Grid key={`blank-${i}`} item xs={12 / 7} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
          const key = `${year}-${month}-${date}`;
          const hasSchedule = schedule[key]?.length > 0;
          return (
            <Grid key={date} item xs={12 / 7}>
              <Paper
                onClick={() => onDateClick(date)}
                sx={{
                  cursor: "pointer",
                  p: 1,
                  bgcolor:
                    selectedDate === date
                      ? "primary.light"
                      : "background.paper",
                  border: hasSchedule ? "2px solid #1976d2" : "1px solid #ccc",
                  height: 60,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  userSelect: "none",
                }}
                elevation={selectedDate === date ? 6 : 1}
              >
                <Typography variant="body1" fontWeight="bold">
                  {date}
                </Typography>
                {hasSchedule && (
                  <Box sx={{ fontSize: 10, color: "#1976d2" }}>
                    {schedule[key].length}건
                  </Box>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {selectedDate && (
        <Box mt={4}>
          <Typography variant="h6" mb={1}>
            {year}년 {month}월 {selectedDate}일 일정
          </Typography>

          <List dense>
            {(schedule[`${year}-${month}-${selectedDate}`] || []).map(
              (item, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={item} />
                </ListItem>
              )
            )}
          </List>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              label="일정 추가"
              size="small"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSchedule();
              }}
            />
            <Button variant="contained" onClick={addSchedule}>
              추가
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
