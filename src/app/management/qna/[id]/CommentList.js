"use client"; // Next.js에서 클라이언트 사이드에서 동작함을 명시

import { useEffect, useState } from "react"; // React hook 사용
import { Box, Typography, Paper, CircularProgress } from "@mui/material"; // MUI 컴포넌트 import

// 댓글 리스트 컴포넌트
export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]); // 댓글 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 클라이언트 환경일 때만 localStorage 접근해서 토큰 가져옴
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 댓글 데이터를 서버에서 가져오는 함수
  const fetchComments = () => {
    if (!token) return; // 토큰 없으면 요청 안 보냄 (비로그인 상태)

    fetch(`http://localhost:8080/api/management/qna/${postId}/comment/list`, {
      headers: { Authorization: `Bearer ${token}` }, // 인증 헤더 포함
    })
      .then((res) => {
        if (!res.ok) throw new Error("댓글 불러오기 실패"); // 실패 시 에러
        return res.json(); // 응답을 JSON으로 파싱
      })
      .then((data) => {
        // 삭제되지 않은 댓글만 필터링해서 상태에 저장
        const visible = data.filter((comment) => !comment.deleted);
        setComments(visible);
      })
      .catch((err) => console.error("❌ 댓글 가져오기 실패:", err)) // 오류 로그
      .finally(() => setLoading(false)); // 로딩 종료
  };

  // 컴포넌트가 처음 mount되거나 postId가 바뀔 때 댓글 목록 가져옴
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 로딩 중이면 로딩 스피너 출력
  if (loading)
    return (
      <Box sx={{ mt: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );

  // 댓글이 없는 경우 메시지 표시
  if (!comments.length)
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          댓글이 없습니다.
        </Typography>
      </Box>
    );

  // 댓글 목록 표시
  return (
    <Box mt={2}>
      <Typography variant="subtitle1" gutterBottom>
        댓글 목록
      </Typography>

      {/* 댓글 하나하나를 Paper로 감싸서 렌더링 */}
      {comments.map((c) => (
        <Paper key={c.id} sx={{ p: 2, my: 1, backgroundColor: "#f5f5f5" }}>
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            {/* 이메일이 있으면 이메일, 없으면 작성자 ID */}
            {c.email ?? `작성자 ID: ${c.writerId}`} •{" "}
            {/* 날짜 포맷 처리: 2024-07-02T10:00 → 2024-07-02 10:00 */}
            {c.wroteAt?.slice(0, 16).replace("T", " ")}
          </Typography>

          {/* 댓글 본문 */}
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {c.content}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
