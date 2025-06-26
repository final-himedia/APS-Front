"use client";

import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";

export default function RegisterDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !name || !password || !confirm) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (!email.includes("@")) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, role: "User" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "회원가입 실패");
      }

      const data = await res.json();

      // localStorage.setItem("token", data.token);
      // localStorage.setItem("userId", data.user.id);

      alert("회원가입이 완료되었습니다!");
      onClose();
      setEmail("");
      setPassword("");
      setConfirm("");
      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent
        sx={{
          pt: 1,
          pb: 3,
          px: 4,
          minHeight: "520px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        {/* 상단 로고 */}
        <Box sx={{ textAlign: "left", mb: 3, ml: -1 }}>
          <img
            src="/logo/main-logo.png"
            alt="MAIDAY 로고"
            style={{ height: "50px" }}
          />
        </Box>

        {/* 입력 필드들 */}
        <TextField
          fullWidth
          placeholder="이메일주소"
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          placeholder="이름"
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          placeholder="비밀번호"
          type="password"
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          placeholder="비밀번호 확인"
          type="password"
          margin="dense"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* 에러 메시지 */}
        {error && <Box sx={{ color: "red", fontSize: 13, mt: 1 }}>{error}</Box>}

        {/* 캐릭터 이미지 */}
        <Box
          component="img"
          src="/logo/MAIDAYlogin.png"
          alt="캐릭터"
          sx={{
            width: 190,
            position: "absolute",
            right: 12,
            bottom: 49,
          }}
        />

        {/* 가입 버튼 */}
        <Box sx={{ mt: "auto" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: "#d50000",
              "&:hover": { backgroundColor: "#b71c1c" },
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            {loading ? "가입 중..." : "가입하기"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
