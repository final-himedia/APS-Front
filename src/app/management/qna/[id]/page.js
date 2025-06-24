"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ useRouter 추가
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function QnaDetailPage() {
  const { id } = useParams();
  const router = useRouter(); // ✅ 뒤로가기 위해 추가

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const [myUserId, setMyUserId] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setMyUserId(Number(userId));
  }, []);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleDeletePost = () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch(`http://localhost:8080/api/management/qna/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제 실패");
        alert("삭제되었습니다.");
        window.location.href = "/management/qna";
      })
      .catch((err) => {
        console.error("❌ 게시글 삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
  };

  const startEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  };

  const handleUpdatePost = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/management/qna/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
          }),
        }
      );

      if (!res.ok) throw new Error("수정 실패");

      const updatedPost = await res.json();
      updatedPost.name = post.name;
      setPost(updatedPost);
      setEditing(false);
      alert("수정되었습니다.");
      setOpenEditDialog(false);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch(`http://localhost:8080/api/management/qna/detail/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
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

    fetch(`http://localhost:8080/api/management/qna/${id}/comment/list`, {
      headers: { Authorization: `Bearer ${token}` },
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

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

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
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("댓글 삭제 실패");
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
  if (!post || myUserId === null) return null;

  const visibleComments = comments.filter((c) => !c.deleted);

  return (
    <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
      {/* 🔙 뒤로가기 버튼 */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="text"
          onClick={() => router.back()}
          sx={{
            textTransform: "none",
            color: "#444",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          뒤로가기
        </Button>
      </Box>

      {/* ✍ 댓글 작성 입력창 (게시글보다 위) */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="댓글 작성"
          multiline
          minRows={3}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          fullWidth
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={commentLoading}
            sx={{
              backgroundColor: "#dd0000",
              "&:hover": {
                backgroundColor: "#bb0000",
                boxShadow: "none",
              },
            }}
          >
            등록
          </Button>
        </Box>
      </Paper>

      {/* 📰 게시글 본문 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* 제목 + 수정/삭제 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">{post.title}</Typography>
          {post.writerId === myUserId && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  startEdit();
                  setOpenEditDialog(true);
                }}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleDeletePost}
              >
                삭제
              </Button>
            </Box>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          작성자: {post.name} | 작성일: {post.wroteAt?.slice(0, 10)}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mt: 2 }}>
          {post.content}
        </Typography>
      </Paper>

      {/* 🗨 댓글 리스트는 그 아래 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          댓글 ({visibleComments.length})
        </Typography>

        {visibleComments.map((comment) => (
          <Box
            key={comment.id}
            sx={{ mb: 2, borderBottom: "1px solid #eee", pb: 1 }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              작성자: {comment.name} | 작성일: {comment.wroteAt?.slice(0, 10)}
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
                <Stack direction="row" spacing={1} mt={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => saveEditing(comment.id)}
                    disabled={commentLoading}
                  >
                    저장
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
      </Paper>
    </Box>
  );
}
