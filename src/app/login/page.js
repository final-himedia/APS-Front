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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterDialog from "./RegisterDialog";

export default function LoginPage() {
  const [openRegister, setOpenRegister] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

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
        // 이전 사용자 관련 localStorage 데이터 초기화
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("favorites_") || key === "lastPath") {
            localStorage.removeItem(key);
          }
        });

        if (rememberEmail) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        const lastPath = localStorage.getItem("lastPath");
        if (lastPath && lastPath !== "/login") {
          router.push(lastPath);
          localStorage.removeItem("lastPath");
        } else {
          router.push("/");
        }
      } else {
        setError(result?.message || "로그인 실패");
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
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 2,
          bgcolor: "white",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          로그인 테스트
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

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
            />
          }
          label="아이디 기억하기"
        />

        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 1 }}
        >
          로그인
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
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

      {/* 회원가입 다이얼로그 */}
      <RegisterDialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />

      {/* 비밀번호 찾기 다이얼로그 */}
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
