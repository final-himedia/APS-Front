"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) {
      setResult("❌ 로그인 정보가 없습니다. 다시 로그인 해주세요.");
      setTimeout(() => router.push("/login"), 2000);
    }
  }, []);

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.email,
            oldPassword,
            newPassword,
          }),
        }
      );

      const resText = await response.text();

      if (response.ok) {
        setResult("✅ 비밀번호가 변경되었습니다.");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, isTemporaryPassword: false }) // 플래그 제거
        );
        setTimeout(() => {
          router.push("/"); // 홈 또는 마이페이지로 이동
        }, 1500);
      } else {
        setResult("❌ " + resText);
      }
    } catch (err) {
      setResult("❌ 서버 오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h6" mb={2}>
        비밀번호 재설정
      </Typography>

      <TextField
        label="현재 비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <TextField
        label="새 비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {result && (
        <Typography
          variant="caption"
          color={result.startsWith("✅") ? "green" : "error"}
          sx={{ display: "block", mt: 1 }}
        >
          {result}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, backgroundColor: "#d50000" }}
        onClick={handleChangePassword}
      >
        비밀번호 변경
      </Button>
    </Box>
  );
}
