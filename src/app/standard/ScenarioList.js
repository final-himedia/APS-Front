"use client";

import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const scenarioIds = [
  "S010000",
  "S020000",
  "S030000",
  "S040000",
  "S050000",
  "S060000",
];

export default function ScenarioList() {
  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Typography variant="h6" p={2}>
        📋 시나리오 목록
      </Typography>
      <Divider />
      <List dense>
        {scenarioIds.map((id) => (
          <ListItem key={id} button>
            <ListItemText primary={id} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
