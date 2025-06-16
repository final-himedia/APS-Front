"use client";

import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import AddIcon from "@mui/icons-material/Add";
// 생략된 import 및 useState/handlers 등은 그대로 유지

export default function UserManagementPage() {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/management/user-management")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data?.resultList || []).map((item, index) => ({
          id: index + 1,
          userId: item.userId,
          name: item.name,
          roles: (item.roles || []).join(", "),
        }));
        setRows(formatted);
      })
      .catch((err) => {
        console.error("사용자 목록 로딩 실패:", err);
      });
  };

  const handleAdd = () => {
    console.log("추가 버튼 클릭");
  };

  const handleEdit = (row) => {
    console.log("수정 클릭:", row);
  };

  const handleDeleteRow = (row) => {
    console.log("삭제 클릭:", row);
  };

  const handleResetPassword = (row) => {
    console.log("비밀번호 초기화 클릭:", row);
  };

  const handleSelectionChange = (ids) => {
    setSelectedRows(ids);
  };

  const columns = [
    { field: "id", headerName: "순번", width: 80 },
    { field: "userId", headerName: "사용자 ID", width: 200 },
    { field: "name", headerName: "이름", width: 150 },
    { field: "roles", headerName: "역할", width: 250 },
    {
      field: "edit",
      headerName: "수정",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "삭제",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteRow(params.row)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "reset",
      headerName: "Reset Password",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleResetPassword(params.row)}
        >
          <LockResetIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        사용자 관리
      </Typography>

      {/* 툴바: 추가 버튼만 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          p: 1,
          backgroundColor: "#f9f9f9",
          border: "1px solid #d0d7e2",
          borderRadius: 1,
          mb: 1,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon fontSize="small" />}
          onClick={handleAdd}
        >
          추가
        </Button>
      </Box>

      {/* 사용자 목록 테이블 */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
        sx={{ border: 0, mt: 1 }}
        rowHeight={42}
      />
    </Box>
  );
}
