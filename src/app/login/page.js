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
import { useRouter } from "next/navigation";
import RegisterDialog from "./RegisterDialog";

export default function LoginPage() {
  const [openRegister, setOpenRegister] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/"); // 대시보드나 홈으로 리다이렉트
      } else {
        setError(result || "로그인 실패");
      }
    } catch (err) {
      setError("서버 에러");
    }
  };

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 1 }}
          onClick={handleLogin}
        >
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

      <RegisterDialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />

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
