"use client";

import {
  Box,
  Button,
  Dialog,
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

  // 비밀번호 찾기용
  const [resetEmail, setResetEmail] = useState("");
  const [resetResult, setResetResult] = useState("");

  const router = useRouter();

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userId", result.user.id);

        // ✅ 임시 비밀번호면 강제 이동
        if (result.user.isTemporaryPassword) {
          router.push("/user/change-password");
          return;
        }

        const lastPath = localStorage.getItem(`lastPath_${result.user.id}`);
        if (lastPath && lastPath !== "/login") {
          router.push(lastPath);
          localStorage.removeItem(`lastPath_${result.user.id}`);
        } else {
          router.push("/");
        }
      } else {
        setError(result?.message || "로그인 실패");
      }
    } catch (err) {
      setError("비밀번호를 정확히 입력해 주세요");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8080/api/auth/find-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      const result = await response.text();

      if (response.ok) {
        setResetResult("✅ 임시 비밀번호가 이메일로 전송되었습니다.");
        setTimeout(() => {
          setOpenResetPassword(false);
          setResetResult("");
          setResetEmail("");
        }, 2000);
      } else {
        setResetResult(`❌ ${result}`);
      }
    } catch (error) {
      setResetResult("❌ 서버 오류가 발생했습니다.");
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
        />
        <TextField
          fullWidth
          margin="normal"
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
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
            sx={{ fontSize: "0.9rem", color: "#dd0000" }}
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
        onClose={() => {
          setOpenResetPassword(false);
          setResetResult("");
          setResetEmail("");
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent
          sx={{
            pt: 8,
            pb: 3,
            position: "relative",
            textAlign: "center",
          }}
        >
          {/* 로고 */}
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

          <Typography variant="body1" sx={{ mb: 2, mt: 1, fontWeight: "bold" }}>
            비밀번호를 찾을 이메일을 입력해주세요.
          </Typography>

          <TextField
            fullWidth
            placeholder="가입한 이메일"
            variant="outlined"
            margin="normal"
            size="small"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />

          {resetResult && (
            <Typography
              variant="caption"
              sx={{
                color: resetResult.startsWith("✅") ? "green" : "red",
                mt: 1,
                display: "block",
              }}
            >
              {resetResult}
            </Typography>
          )}

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
            onClick={handleResetPassword}
          >
            비밀번호 재설정 링크 보내기
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
