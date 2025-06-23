"use client";

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function QnaPage() {
  const [tab, setTab] = useState(0);
  const [searchType, setSearchType] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);

  // 글쓰기 다이얼로그 상태
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  // 검색
  const [allPosts, setAllPosts] = useState([]);

  // QnA 리스트 불러오기 (작성자 이메일 포함)
  const fetchQnaList = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/management/qna/list", {
      headers: token ? { Authorization: "Bearer " + token } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("❌ 서버 응답이 배열이 아님:", data);
          return;
        }
        const filtered = data.filter((d) => !d.deleted);
        setPosts(filtered); // 화면에 보여줄 데이터
        setAllPosts(filtered); // 전체 데이터 저장 (검색용)
      })
      .catch((err) => console.error("❌ QnA fetch 에러:", err));
  };

  useEffect(() => {
    fetchQnaList();
  }, []);

  // 페이지네이션 처리
  const paginatedPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 새 글 저장
  const handleSave = () => {
    let hasError = false;

    // 유효성 검사
    if (!newTitle.trim()) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    if (!newContent.trim()) {
      setContentError(true);
      hasError = true;
    } else {
      setContentError(false);
    }

    if (hasError) {
      return; // 에러가 있으면 저장 요청 안 보냄
    }

    // 저장 요청
    const token = localStorage.getItem("token");
    const writerId = Number(localStorage.getItem("userId"));
    const wroteAt = new Date().toISOString();

    fetch("http://localhost:8080/api/management/qna", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        writerId,
        title: newTitle,
        content: newContent,
        wroteAt,
        deleted: false,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("글 저장 실패");
        return res.json();
      })
      .then((result) => {
        console.log("✅ 저장 성공:", result);
        fetchQnaList();
      })
      .catch((err) => {
        console.error("❌ 에러 발생:", err);
        alert("글 저장 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setOpen(false);
        setNewTitle("");
        setNewContent("");
      });
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Q&A 게시판
      </Typography>

      {/* 검색 */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Select
          size="small"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <MenuItem value="title">제목</MenuItem>
          <MenuItem value="writer">작성자</MenuItem>
        </Select>

        <TextField
          size="small"
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const keyword = searchText.toLowerCase();
              const filtered = allPosts.filter((post) => {
                if (searchType === "title") {
                  return post.title.toLowerCase().includes(keyword);
                } else if (searchType === "writer") {
                  return (
                    post.name?.toLowerCase().includes(keyword) ||
                    post.email?.toLowerCase().includes(keyword)
                  );
                }
                return true;
              });
              setPosts(filtered);
              setPage(1);
            }
          }}
          sx={{ width: 300 }}
        />

        <Button
          variant="text"
          sx={{
            backgroundColor: "#f2e8e8",
            color: "#000000",
            px: 3,
            "&:hover": {
              backgroundColor: "#f5d2d2",
              color: "#000000",
            },
          }}
          onClick={() => {
            const keyword = searchText.toLowerCase();

            const filtered = allPosts.filter((post) => {
              if (searchType === "title") {
                return post.title.toLowerCase().includes(keyword);
              } else if (searchType === "writer") {
                return (
                  post.name?.toLowerCase().includes(keyword) ||
                  post.email?.toLowerCase().includes(keyword)
                );
              }
              return true;
            });

            setPosts(filtered);
            setPage(1); // 첫 페이지로 리셋
          }}
        >
          검색
        </Button>
      </Stack>

      {/* 탭 */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mb: 2 }}
        TabIndicatorProps={{ style: { display: "none" } }} // 기본 밑줄 제거
      >
        <Tab
          label="전체"
          sx={{
            color: "#666666",
            position: "relative",
            "&.Mui-selected": {
              color: "#666666",
            },
            "&.Mui-selected::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "#666666",
            },
          }}
        />
        <Tab
          label="공지"
          sx={{
            color: "#dd0000",
            position: "relative",
            "&.Mui-selected": {
              color: "#dd0000",
            },
            "&.Mui-selected::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "#dd0000",
            },
          }}
        />
      </Tabs>

      {/* 게시판 테이블 */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>번호</TableCell>
            <TableCell>제목</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell>작성일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                등록된 게시글이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            paginatedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>
                  <Link href={`/management/qna/${post.id}`} passHref>
                    <Typography
                      sx={{
                        color: "grey",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {post.title}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell>{post.email}</TableCell>
                <TableCell>{post.wroteAt?.slice(0, 10)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 페이지네이션 */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(posts.length / PAGE_SIZE)}
          page={page}
          onChange={(e, val) => setPage(val)}
          sx={{
            "& .Mui-selected": {
              backgroundColor: "#f2e8e8",
              color: "#fff",
            },
            "& .MuiPaginationItem-root": {
              color: "#333",
            },
          }}
        />
      </Box>

      {/* 글쓰기 버튼 */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="text"
          onClick={() => setOpen(true)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: "12px",
            backgroundColor: "#f2e8e8",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#f5d2d2",
              color: "#000000",
            },
          }}
        >
          글쓰기
        </Button>
      </Box>

      {/* 글쓰기 다이얼로그 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 1, // 둥근 테두리 줄이기
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          게시판 글쓰기
        </DialogTitle>
        <Divider
          sx={{
            borderBottomWidth: 2,
            borderColor: "#808080",
            width: "95%",
            mx: "auto",
          }}
        />
        <DialogContent>
          <TextField
            label="제목"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
            error={titleError}
            helperText={titleError ? "제목을 입력해주세요" : ""}
          />

          <TextField
            label="내용"
            fullWidth
            multiline
            rows={5}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            margin="normal"
            error={contentError}
            helperText={contentError ? "내용을 입력해주세요" : ""}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#808080" }}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
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
        </DialogActions>
      </Dialog>
    </Box>
  );
}
