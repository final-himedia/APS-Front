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
  // 1. URL 파라미터에서 게시글 ID 추출
  const { id } = useParams();

  // 2. 라우터 객체 (뒤로가기 등에 사용)
  const router = useRouter();

  // 3. 게시글 상태 관리
  const [post, setPost] = useState(null); // 게시글 데이터
  const [loading, setLoading] = useState(true); // 로딩 여부
  const [error, setError] = useState(null); // 에러 상태

  // 4. 댓글 상태 관리
  const [comments, setComments] = useState([]); // 댓글 목록
  const [commentInput, setCommentInput] = useState(""); // 댓글 입력 텍스트
  const [commentLoading, setCommentLoading] = useState(false); // 댓글 처리 중 로딩
  const [commentError, setCommentError] = useState(null); // 댓글 처리 에러

  // 5. 로그인한 사용자 ID 저장 (권한 판단용)
  const [myUserId, setMyUserId] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setMyUserId(Number(userId));
  }, []);

  // 6. 게시글 수정 관련 상태
  const [editing, setEditing] = useState(false); // 수정 중 여부 (사용 안됨)
  const [editTitle, setEditTitle] = useState(""); // 수정 중 제목
  const [editContent, setEditContent] = useState(""); // 수정 중 내용
  const [openEditDialog, setOpenEditDialog] = useState(false); // 수정 다이얼로그 열림 여부

  // 7. 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editingContent, setEditingContent] = useState(""); // 수정 중 댓글 내용

  // 8. 게시글 상세 + 댓글 리스트 API 호출
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 게시글 상세 불러오기
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

    // 댓글 리스트 불러오기
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

  // 삭제된 댓글은 화면에서 제외
  const visibleComments = comments.filter((c) => !c.deleted);

  // 9. 게시글 삭제 처리
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
        window.location.href = "/management/qna"; // 삭제 후 목록으로 이동
      })
      .catch((err) => alert("삭제 중 오류 발생"));
  };

  // 10. 게시글 수정 시작 (수정 폼 열기)
  const startEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  };

  // 11. 게시글 수정 완료 API 호출
  const handleUpdatePost = async () => {
    if (!editTitle.trim() || !editContent.trim())
      return alert("제목과 내용을 입력해주세요.");
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(
        `http://localhost:8080/api/management/qna/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: editTitle, content: editContent }),
        }
      );
      if (!res.ok) throw new Error("수정 실패");
      const updatedPost = await res.json();
      updatedPost.name = post.name; // 작성자 이름 유지
      setPost(updatedPost);
      setEditing(false);
      setOpenEditDialog(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // 12. 댓글 등록 처리
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
        setComments((prev) => [...prev, newComment]); // 댓글 리스트에 추가
        setCommentInput(""); // 입력 필드 초기화
      })
      .catch(() => setCommentError("댓글 등록 중 오류"))
      .finally(() => setCommentLoading(false));
  };

  // 13. 댓글 수정 시작 (수정 폼 열기)
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // 14. 댓글 수정 취소
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  // 15. 댓글 수정 저장 API 호출
  const saveEditing = (commentId) => {
    if (!editingContent.trim()) return alert("댓글 내용을 입력하세요.");
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    setCommentLoading(true);
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
      .then((res) => res.json())
      .then((updatedComment) => {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? updatedComment : c))
        );
        cancelEditing();
      })
      .catch(() => setCommentError("댓글 수정 실패"))
      .finally(() => setCommentLoading(false));
  };

  // 16. 댓글 삭제 처리
  const deleteComment = (commentId) => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    setCommentLoading(true);
    fetch(
      `http://localhost:8080/api/management/qna/${id}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(() => setComments((prev) => prev.filter((c) => c.id !== commentId)))
      .catch(() => setCommentError("댓글 삭제 실패"))
      .finally(() => setCommentLoading(false));
  };

  // 17. 로딩 및 에러 처리 UI
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!post || myUserId === null) return null;

  // 18. 렌더링 (게시글 + 댓글 UI)
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      {/* 뒤로가기 버튼 */}
      <Button onClick={() => router.back()} sx={{ mb: 2 }}>
        뒤로가기
      </Button>

      {/* 게시글 제목/작성자/내용 */}
      <Box sx={{ mb: 3, minHeight: 200 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: "bold" }}>
            {post.title}
          </Typography>
          {/* 본인 글일 경우 수정/삭제 버튼 */}
          {post.writerId === myUserId && (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  startEdit();
                  setOpenEditDialog(true);
                }}
              >
                수정
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={handleDeletePost}
              >
                삭제
              </Button>
            </Stack>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          작성자: {post.name} | 작성일: {post.wroteAt?.slice(0, 10)}
        </Typography>
        <Typography sx={{ whiteSpace: "pre-line", mt: 3, fontSize: "1.05rem" }}>
          {post.content}
        </Typography>
      </Box>

      {/* 게시글 수정 다이얼로그 */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>게시글 수정</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="제목"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="내용"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ color: "#dd0000" }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdatePost}
            sx={{
              backgroundColor: "#dd0000",
              "&:hover": { backgroundColor: "#bb0000" },
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Divider sx={{ my: 3 }} />

      {/* 댓글 작성 입력란 */}
      <Box sx={{ mb: 4 }}>
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
              "&:hover": { backgroundColor: "#bb0000" },
            }}
          >
            등록
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 댓글 목록 */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          댓글 ({visibleComments.length})
        </Typography>
        {visibleComments.map((comment, index) => (
          <Box key={comment.id}>
            {index !== 0 && <Divider sx={{ my: 2 }} />}
            <Typography
              fontWeight="bold"
              fontSize="0.9rem"
              color="text.secondary"
            >
              작성자: {comment.name} | 작성일: {comment.wroteAt?.slice(0, 10)}
            </Typography>

            {/* 댓글 수정 중이면 수정 입력란 보여주기 */}
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
                    sx={{
                      backgroundColor: "#dd0000",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#aa0000",
                      },
                    }}
                  >
                    저장
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={cancelEditing}
                    disabled={commentLoading}
                    sx={{
                      color: "#dd0000",
                      borderColor: "#dd0000",
                      "&:hover": {
                        backgroundColor: "#ffeeee",
                        borderColor: "#bb0000",
                        color: "#bb0000",
                      },
                    }}
                  >
                    취소
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                {/* 댓글 내용 표시 */}
                <Typography sx={{ whiteSpace: "pre-line", mt: 0.5 }}>
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
      </Box>
    </Box>
  );
}
