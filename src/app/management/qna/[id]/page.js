"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function QnaDetailPage() {
  const { id } = useParams(); // URL에서 id 추출
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]); // 댓글 목록
  const [commentInput, setCommentInput] = useState(""); // 새 댓글 입력
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 게시글 불러오기
    fetch(`http://localhost:8080/api/management/qna/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("불러오기 실패");
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

    //댓글 불러오기
    fetch(`http://localhost:8080/api/management/qna/${id}/comment/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("댓글 불러오기 실패");
        return res.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((err) => {
        console.error("❌ 댓글 가져오기 실패:", err);
      });
  }, [id]);

  // 새 댓글 등록
  const handleCommentSubmit = () => {
    if (!commentInput.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    fetch(`http://localhost:8080/api/management/qna/${id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: commentInput }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("댓글 등록 실패");
        return res.json();
      })
      .then((newComment) => {
        setComments((prev) => [...prev, newComment]);
        setCommentInput("");
      })
      .catch((err) => {
        console.error("❌ 댓글 등록 실패:", err);
        setCommentError("댓글 등록 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  // 댓글 수정 시작
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // 댓글 수정 취소
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  // 댓글 수정 저장
  const saveEditing = (commentId) => {
    if (!editingContent.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    fetch(
      `http://localhost:8080/api/management/qna/${id}/comment/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editingContent }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("댓글 수정 실패");
        return res.json();
      })
      .then((updatedComment) => {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? updatedComment : c))
        );
        cancelEditing();
      })
      .catch((err) => {
        console.error("❌ 댓글 수정 실패:", err);
        setCommentError("댓글 수정 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  // 댓글 삭제
  const deleteComment = (commentId) => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    fetch(
      `http://localhost:8080/api/management/qna/${id}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("댓글 삭제 실패");
        // 보통 삭제는 204 No Content 리턴
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      })
      .catch((err) => {
        console.error("❌ 댓글 삭제 실패:", err);
        setCommentError("댓글 삭제 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!post) return null;

  const visibleComments = comments.filter((c) => !c.deleted);

  return (
    <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
      <Paper sx={{ p: 3, mb: 3 }}>
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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          댓글 ({visibleComments.length})
        </Typography>

        {visibleComments.length === 0 && (
          <Typography color="text.secondary">댓글이 없습니다.</Typography>
        )}

        {visibleComments.map((comment) => (
          <Box
            key={comment.id}
            sx={{ mb: 2, borderBottom: "1px solid #eee", pb: 1 }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              작성자: {comment.writerId} | 작성일:{" "}
              {comment.wroteAt?.slice(0, 10)}
            </Typography>

            {editingCommentId === comment.id ? (
              <>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  disabled={commentLoading}
                />
                {commentError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {commentError}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} mt={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => saveEditing(comment.id)}
                    disabled={commentLoading}
                  >
                    {commentLoading ? "저장 중..." : "저장"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={cancelEditing}
                    disabled={commentLoading}
                  >
                    취소
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {comment.content}
                </Typography>
                <Stack direction="row" spacing={1} mt={0.5}>
                  <Button size="small" onClick={() => startEditing(comment)}>
                    수정
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteComment(comment.id)}
                    disabled={commentLoading}
                  >
                    삭제
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        ))}

        <Stack spacing={1} mt={2}>
          <TextField
            label="댓글 작성"
            multiline
            minRows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            disabled={commentLoading}
          />
          {commentError && editingCommentId === null && (
            <Typography color="error" variant="body2">
              {commentError}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={commentLoading}
          >
            {commentLoading ? "등록 중..." : "댓글 등록"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
