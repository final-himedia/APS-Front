"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchComments = () => {
    if (!token) return;

    fetch(`http://127.0.0.1:8080/api/management/qna/${postId}/comment`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("댓글 불러오기 실패");
        return res.json();
      })
      .then((data) => {
        // 삭제되지 않은 댓글만 표시
        const visible = data.filter((comment) => !comment.deleted);
        setComments(visible);
      })
      .catch((err) => console.error("❌ 댓글 가져오기 실패:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (loading) return <CircularProgress size={20} />;
  if (!comments.length)
    return <Typography variant="body2">댓글이 없습니다.</Typography>;

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        댓글
      </Typography>
      {comments.map((c) => (
        <Paper key={c.id} sx={{ p: 2, my: 1 }}>
          <Typography variant="body2" color="text.secondary">
            작성자 ID: {c.writerId} | 작성일: {c.wroteAt?.slice(0, 10)}
          </Typography>
          <Typography variant="body1">{c.content}</Typography>
        </Paper>
      ))}
    </Box>
  );
}
