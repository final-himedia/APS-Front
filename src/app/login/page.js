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

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
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
        router.push("/"); // 홈 또는 리다이렉션 경로
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
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          bgcolor: "white",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* 로고 */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src="/logo/login-logo.png"
            alt="MAIDAY 로그인"
            style={{ maxWidth: "170px", height: "auto", marginBottom: "12px" }}
          />
        </Box>

        {/* 제목 */}
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ mt: -4, mb: 4, fontSize: "24px" }}
        >
          로그인
        </Typography>

        {/* 이메일/비밀번호 입력 */}
        <TextField
          fullWidth
          margin="normal"
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          InputProps={{
            sx: {
              fontSize: "14px",
              padding: "6px 10px",
            },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          InputProps={{
            sx: {
              fontSize: "14px",
              padding: "6px 10px",
            },
          }}
        />

        {/* 에러 메시지 */}
        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}

        {/* 로그인 버튼 */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "#d50000",
            "&:hover": { backgroundColor: "#b71c1c" },
            borderRadius: "8px",
          }}
        >
          로그인
        </Button>

        {/* 링크: 비번찾기 / 회원가입 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            px: 0.5,
          }}
        >
          <Link
            href="#"
            underline="hover"
            sx={{ fontSize: "0.9rem", color: "#616161" }}
            onClick={() => setOpenResetPassword(true)}
          >
            비밀번호 찾기
          </Link>
          <Link
            href="#"
            underline="hover"
            sx={{ fontSize: "0.9rem", color: "#616161" }}
            onClick={() => setOpenRegister(true)}
            sx={{ color: "#dd0000", fontSize: "0.9rem" }}
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

      {/* 비밀번호 재설정 다이얼로그 */}
      <Dialog
        open={openResetPassword}
        onClose={() => setOpenResetPassword(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent
          sx={{
            pt: 8, // ← 상단 여백 넉넉하게
            pb: 3,
            position: "relative",
            textAlign: "center",
          }}
        >
          {/* 로고 이미지 */}
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 160,
              height: "auto",
            }}
          >
            <img
              src="/logo/main-logo.png"
              alt="로고"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </Box>

          {/* 설명 문구 */}
          <Typography variant="body1" sx={{ mb: 2, mt: 1, fontWeight: "bold" }}>
            비밀번호를 찾을 이메일을 입력해주세요.
          </Typography>

          {/* 이메일 입력 필드 */}
          <TextField
            fullWidth
            placeholder="가입한 이메일"
            variant="outlined"
            margin="normal"
            size="small"
          />

          {/* 전송 버튼 */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#d50000",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
              color: "#fff",
              borderRadius: "8px",
            }}
          >
            비밀번호 재설정 링크 보내기
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
