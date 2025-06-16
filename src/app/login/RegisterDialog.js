"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function RegisterDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // 이름 추가
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
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
        body: JSON.stringify({
          email,
          password,
          role: "User",
          name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "회원가입 실패");
      }

      alert("회원가입이 완료되었습니다!");
      onClose(); // 모달 닫기
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
      <DialogTitle>회원가입</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="이메일"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="이름"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="비밀번호"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="비밀번호 확인"
          type="password"
          margin="normal"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && (
          <div style={{ color: "red", marginTop: 8, fontSize: 14 }}>
            {error}
          </div>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "가입 중..." : "가입하기"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
