"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";

export default function QnaDetailPage() {
  const { id } = useParams(); // URL에서 id 추출
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch(`http://localhost:8080/api/management/qna/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("불러오기 실패");
        }
        return res.json();
      })
      .then((data) => {
        setPost(data);
      })
      .catch((err) => {
        console.error("❌ 상세글 가져오기 실패:", err);
        setError("게시글을 불러올 수 없습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!post) return null;

  return (
    <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          작성자: {post.writerId} | 작성일: {post.wroteAt?.slice(0, 10)}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mt: 2 }}>
          {post.content}
        </Typography>
      </Paper>
    </Box>
  );
}
