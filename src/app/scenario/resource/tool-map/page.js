"use client";

import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function ToolMasterTable({ data }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 500, overflowX: "auto", width: "100%" }}
    >
      <Table
        stickyHeader
        size="small"
        aria-label="tool master table"
        sx={{ minWidth: 1000 }}
      >
        <TableHead>
          <TableRow>
            <TableCell>순번</TableCell>
            <TableCell>Tool Id</TableCell>
            <TableCell>Tool Name</TableCell>
            <TableCell>Site ID</TableCell>
            <TableCell>Tool State</TableCell>
            <TableCell>Scenario ID</TableCell>
            <TableCell>Tool Cavity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={row.toolId}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{row.toolId}</TableCell>
              <TableCell>{row.toolName}</TableCell>
              <TableCell>{row.siteId}</TableCell>
              <TableCell>{row.toolState}</TableCell>
              <TableCell>{row.scenarioId || "-"}</TableCell>
              <TableCell>{row.toolCavity || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function ToolMasterOnly() {
  const [toolData, setToolData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchToolData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8080/api/scenarios/resource/tool-master"
        );
        setToolData(res.data.toolMasters || []);
      } catch (err) {
        console.error("Error fetching tool master data:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchToolData();
  }, []);

  return (
    <Box sx={{ p: 2, width: "100%", overflowX: "auto" }}>
      <Typography variant="h6" gutterBottom>
        작업도구마스터 데이터
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ToolMasterTable data={toolData} />
      )}
    </Box>
  );
}
