"use client";

import { Box, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";

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
      <IconButton color="error" onClick={() => handleDelete(params.row)}>
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
// 가짜 핸들러들 — 실제 기능은 나중에 연결하세요
const handleEdit = (row) => {
  console.log("수정 클릭:", row);
};

const handleDelete = (row) => {
  console.log("삭제 클릭:", row);
};

const handleResetPassword = (row) => {
  console.log("비밀번호 초기화 클릭:", row);
};

export default function UserManagementPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6">사용자 관리</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0, mt: 1 }}
        rowHeight={42}
      />
    </Box>
  );
}
