"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 토큰 가져오기
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchComments = () => {
    if (!token) return;

    fetch(`http://localhost:8080/api/management/qna/${postId}/comment/list`, {
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

  if (loading)
    return (
      <Box sx={{ mt: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );

  if (!comments.length)
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          댓글이 없습니다.
        </Typography>
      </Box>
    );

  return (
    <Box mt={2}>
      <Typography variant="subtitle1" gutterBottom>
        댓글 목록
      </Typography>
      {comments.map((c) => (
        <Paper key={c.id} sx={{ p: 2, my: 1, backgroundColor: "#f5f5f5" }}>
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            {c.email ?? `작성자 ID: ${c.writerId}`} •{" "}
            {c.wroteAt?.slice(0, 16).replace("T", " ")}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {c.content}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
