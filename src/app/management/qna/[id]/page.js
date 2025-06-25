"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

export default function QnaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch(`http://localhost:8080/api/management/qna/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("불러오기 실패");
        return res.json();
      })
      .then((data) => setPost(data))
      .catch((err) => {
        console.error("❌ 상세글 가져오기 실패:", err);
        setError("게시글을 불러올 수 없습니다.");
      })
      .finally(() => setLoading(false));

    fetch(`http://localhost:8080/api/management/qna/${id}/comment/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("댓글 불러오기 실패");
        return res.json();
      })
      .then((data) => setComments(data))
      .catch((err) => {
        console.error("❌ 댓글 가져오기 실패:", err);
      });
  }, [id]);

  const visibleComments = comments.filter((c) => !c.deleted);

  const handleDeletePost = () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    fetch(`http://localhost:8080/api/management/qna/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제 실패");
        alert("삭제되었습니다.");
        window.location.href = "/management/qna";
      })
      .catch((err) => alert("삭제 중 오류 발생"));
  };

  const startEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  };

  const handleUpdatePost = async () => {
    if (!editTitle.trim() || !editContent.trim()) return alert("제목과 내용을 입력해주세요.");
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(`http://localhost:8080/api/management/qna/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      if (!res.ok) throw new Error("수정 실패");
      const updatedPost = await res.json();
      updatedPost.name = post.name;
      setPost(updatedPost);
      setEditing(false);
      setOpenEditDialog(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return alert("댓글을 입력하세요.");
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    setCommentLoading(true);
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
      .catch(() => setCommentError("댓글 등록 중 오류"))
      .finally(() => setCommentLoading(false));
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
    if (!editingContent.trim()) return alert("댓글 내용을 입력하세요.");
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    setCommentLoading(true);
    fetch(`http://localhost:8080/api/management/qna/${id}/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editingContent }),
    })
      .then((res) => res.json())
      .then((updatedComment) => {
        setComments((prev) => prev.map((c) => (c.id === commentId ? updatedComment : c)));
        cancelEditing();
      })
      .catch(() => setCommentError("댓글 수정 실패"))
      .finally(() => setCommentLoading(false));
  };

  const deleteComment = (commentId) => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    setCommentLoading(true);
    fetch(`http://localhost:8080/api/management/qna/${id}/comment/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setComments((prev) => prev.filter((c) => c.id !== commentId)))
      .catch(() => setCommentError("댓글 삭제 실패"))
      .finally(() => setCommentLoading(false));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!post || myUserId === null) return null;

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => router.back()} sx={{ mb: 2 }}>
        뒤로가기
      </Button>

      <Box sx={{ mb: 3, minHeight: 200 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: "bold" }}>{post.title}</Typography>
          {post.writerId === myUserId && (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => { startEdit(); setOpenEditDialog(true); }}>수정</Button>
              <Button size="small" color="error" variant="outlined" onClick={handleDeletePost}>삭제</Button>
            </Stack>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          작성자: {post.name} | 작성일: {post.wroteAt?.slice(0, 10)}
        </Typography>
        <Typography sx={{ whiteSpace: "pre-line", mt: 3, fontSize: "1.05rem" }}>{post.content}</Typography>
      </Box>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>게시글 수정</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="제목" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} margin="normal" />
          <TextField fullWidth multiline rows={6} label="내용" value={editContent} onChange={(e) => setEditContent(e.target.value)} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: "#dd0000" }}>취소</Button>
          <Button variant="contained" onClick={handleUpdatePost} sx={{ backgroundColor: "#dd0000", "&:hover": { backgroundColor: "#bb0000" } }}>저장</Button>
        </DialogActions>
      </Dialog>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <TextField label="댓글 작성" multiline minRows={3} value={commentInput} onChange={(e) => setCommentInput(e.target.value)} fullWidth />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button variant="contained" onClick={handleCommentSubmit} disabled={commentLoading} sx={{ backgroundColor: "#dd0000", "&:hover": { backgroundColor: "#bb0000" } }}>등록</Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          댓글 ({visibleComments.length})
        </Typography>
        {visibleComments.map((comment, index) => (
          <Box key={comment.id}>
            {index !== 0 && <Divider sx={{ my: 2 }} />}
            <Typography fontWeight="bold" fontSize="0.9rem" color="text.secondary">
              작성자: {comment.name} | 작성일: {comment.wroteAt?.slice(0, 10)}
            </Typography>
            {editingCommentId === comment.id ? (
              <>
                <TextField multiline minRows={3} fullWidth value={editingContent} onChange={(e) => setEditingContent(e.target.value)} disabled={commentLoading} />
                <Stack direction="row" spacing={1} mt={1}>
                  <Button variant="contained" size="small" onClick={() => saveEditing(comment.id)} disabled={commentLoading}>저장</Button>
                  <Button variant="outlined" size="small" onClick={cancelEditing} disabled={commentLoading}>취소</Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography sx={{ whiteSpace: "pre-line", mt: 0.5 }}>{comment.content}</Typography>
                <Stack direction="row" spacing={1} mt={0.5}>
                  <Button size="small" onClick={() => startEditing(comment)}>수정</Button>
                  <Button size="small" color="error" onClick={() => deleteComment(comment.id)} disabled={commentLoading}>삭제</Button>
                </Stack>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
