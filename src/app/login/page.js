"use client";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { useState } from "react";

export default function LoginPage() {
  const [openRegister, setOpenRegister] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 2,
          bgcolor: "white",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          로그인
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="이메일"
          type="email"
          variant="outlined"
        />
        <TextField
          fullWidth
          margin="normal"
          label="비밀번호"
          type="password"
          variant="outlined"
        />

        <Button fullWidth variant="contained" sx={{ mt: 2, mb: 1 }}>
          로그인
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Link
            href="#"
            underline="hover"
            onClick={() => setOpenResetPassword(true)}
          >
            비밀번호 찾기
          </Link>
          <Link
            href="#"
            underline="hover"
            onClick={() => setOpenRegister(true)}
          >
            회원가입
          </Link>
        </Box>
      </Box>

      {/* 회원가입 모달 */}
      <Dialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>회원가입</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="이메일" margin="normal" />
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            margin="normal"
          />
          <TextField
            fullWidth
            label="비밀번호 확인"
            type="password"
            margin="normal"
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            가입하기
          </Button>
        </DialogContent>
      </Dialog>

      {/* 비밀번호 찾기 모달 */}
      <Dialog
        open={openResetPassword}
        onClose={() => setOpenResetPassword(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>비밀번호 찾기</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="가입한 이메일" margin="normal" />
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            비밀번호 재설정 링크 보내기
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
