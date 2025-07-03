"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
// 생략된 import 및 useState/handlers 등은 그대로 유지

export default function UserManagementPage() {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const router = useRouter();

  const fetchUsers = () => {
    const token = localStorage.getItem("token");

    fetch("15.164.98.31:8080/api/management/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.users || []).map((item, index) => ({
          id: index + 1,
          userId: item.email,
          name: item.name,
          roles: item.role,
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

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const handleEdit = (row) => {
    console.log("수정 클릭:", row);
    setEditData(row); // 수정할 데이터 설정
    setEditOpen(true); // 다이얼로그 열기
  };

  const handleDeleteRow = (row) => {
    console.log("삭제 클릭:", row);
    const token = localStorage.getItem("token");

    if (!window.confirm(`${row.name} 님을 삭제하시겠습니까?`)) return;

    fetch(`15.164.98.31:8080/api/management/user/${row.userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("삭제 실패");
        }
        alert("삭제되었습니다.");
        fetchUsers(); // 다시 목록 로딩
      })
      .catch((err) => {
        console.error("삭제 중 오류 발생:", err);
        alert("삭제 실패");
      });
  };

  const handleSaveEdit = () => {
    const token = localStorage.getItem("token");
    console.log(editData);

    fetch(`15.164.98.31:8080/api/management/user/${editData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editData.id,
        name: editData.name,
        email: editData.userId,
        role: editData.roles,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("수정 실패");
        alert("수정 완료");
        setEditOpen(false);
        fetchUsers();
      })
      .catch((err) => {
        console.error("수정 오류:", err);
        alert("수정 실패");
      });
  };

  const handleResetPassword = async (row) => {
    if (!window.confirm(`${row.name} 님의 비밀번호를 초기화하시겠습니까?`))
      return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "15.164.98.31:8080/api/auth/find-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: row.userId }),
        }
      );

      const result = await response.text();

      if (response.ok) {
        alert("✅ 임시 비밀번호가 이메일로 전송되었습니다.");
      } else {
        alert(`❌ 초기화 실패: ${result}`);
      }
    } catch (error) {
      alert("❌ 서버 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleSelectionChange = (ids) => {
    setSelectedRows(ids);
  };

  const columns = [
    { field: "id", headerName: "순번", width: 80 },
    { field: "userId", headerName: "사용자 ID" },
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

      {/* 사용자 목록 테이블 */}
      <Box width={930}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#f2e8e8",
              color: "#000",
              fontWeight: "bold",
            },
            border: 0, //f2e8e8 수정
          }}
          rowHeight={42}
        />
      </Box>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>사용자 수정</DialogTitle>
        <DialogContent>
          <TextField
            label="사용자ID"
            fullWidth
            margin="dense"
            value={editData?.userId || ""}
            onChange={(e) =>
              setEditData({ ...editData, userId: e.target.value })
            }
          />
          <TextField
            label="이름"
            fullWidth
            margin="dense"
            value={editData?.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <TextField
            label="역할"
            fullWidth
            margin="dense"
            value={editData?.roles || ""}
            onChange={(e) =>
              setEditData({ ...editData, roles: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{ color: "#000" }}>
            취소
          </Button>
          <Button variant="contained" onClick={() => handleSaveEdit(editData)}>
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
