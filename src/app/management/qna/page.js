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

const PAGE_SIZE = 10; // 한 페이지에 보여줄 게시글 개수

export default function QnaPage() {
  // 1. 상태 변수 선언
  const [tab, setTab] = useState(0); // 탭 (전체, 공지)
  const [searchType, setSearchType] = useState("title"); // 검색 조건 (제목/작성자)
  const [searchText, setSearchText] = useState(""); // 검색어
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [posts, setPosts] = useState([]); // 현재 필터링된 게시글 리스트

  // 글쓰기 다이얼로그 상태 변수
  const [open, setOpen] = useState(false); // 글쓰기 다이얼로그 열림 여부
  const [newTitle, setNewTitle] = useState(""); // 새 글 제목
  const [newContent, setNewContent] = useState(""); // 새 글 내용
  const [category, setCategory] = useState("common"); // 새 글 카테고리 (일반글 or 공지글)
  const [titleError, setTitleError] = useState(false); // 제목 입력 오류 여부
  const [contentError, setContentError] = useState(false); // 내용 입력 오류 여부

  // 전체 게시글 저장 (검색, 필터링용)
  const [allPosts, setAllPosts] = useState([]);

  // 2. 게시글 리스트 API 호출 및 초기화 함수
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
        const filtered = data.filter((d) => !d.deleted); // 삭제된 글은 제외
        setPosts(filtered); // 화면에 보여줄 글 리스트 세팅
        setAllPosts(filtered); // 검색 등 전체 데이터 저장
      })
      .catch((err) => console.error("❌ QnA fetch 에러:", err));
  };

  // 3. 컴포넌트 첫 렌더링 시 게시글 목록 불러오기
  useEffect(() => {
    fetchQnaList();
  }, []);

  // 4. 탭(전체, 공지)에 따른 게시글 필터링
  const filteredPosts = posts.filter((post) => {
    if (tab === 1) {
      // 공지 탭이면 카테고리 'notice'인 글만 보여줌
      return post.category === "notice";
    }
    // 전체 탭이면 모두 통과
    return true;
  });

  // 5. 검색 조건과 검색어에 따른 추가 필터링
  const searchedPosts = filteredPosts.filter((post) => {
    if (!searchText.trim()) return true; // 검색어 없으면 모두 통과
    const keyword = searchText.toLowerCase();

    if (searchType === "title") {
      // 제목 검색
      return post.title.toLowerCase().includes(keyword);
    } else if (searchType === "writer") {
      // 작성자 이름 혹은 이메일 검색
      return (
        post.name?.toLowerCase().includes(keyword) ||
        post.email?.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  // 6. 페이지네이션 (현재 페이지에 맞는 게시글만 자름)
  const paginatedPosts = searchedPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // 7. 새 글 저장 처리 함수 (POST API 호출)
  const handleSave = () => {
    let hasError = false;

    // 입력값 검증 - 제목과 내용이 빈 문자열이면 오류 처리
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

    if (hasError) return; // 오류 있으면 저장 취소

    // 토큰, 작성자 아이디, 작성 시간 세팅
    const token = localStorage.getItem("token");
    const writerId = Number(localStorage.getItem("userId"));
    const wroteAt = new Date().toISOString();

    // 서버에 새 글 POST 요청
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
        category, // 카테고리도 같이 보냄
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("글 저장 실패");
        return res.json();
      })
      .then((result) => {
        console.log("✅ 저장 성공:", result);
        fetchQnaList(); // 저장 후 게시글 목록 갱신
      })
      .catch((err) => {
        console.error("❌ 에러 발생:", err);
        alert("글 저장 중 오류가 발생했습니다.");
      })
      .finally(() => {
        // 저장 후 다이얼로그 닫고 입력 초기화
        setOpen(false);
        setNewTitle("");
        setNewContent("");
        setCategory("normal");
      });
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
      {/* 제목 */}
      <Typography variant="h6" gutterBottom>
        Q&A 게시판
      </Typography>

      {/* 8. 검색 영역 */}
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
              setPage(1); // 검색 시 페이지 1로 초기화
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
            setPage(1); // 검색 버튼 클릭 시 페이지 1 초기화
          }}
        >
          검색
        </Button>
      </Stack>

      {/* 9. 탭 영역 (전체, 공지) */}
      <Tabs
        value={tab}
        onChange={(e, v) => {
          setTab(v);
          setPage(1); // 탭 변경 시 페이지 1로 초기화
        }}
        sx={{ mb: 2 }}
        TabIndicatorProps={{ style: { display: "none" } }} // 밑줄 숨김
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

      {/* 10. 게시글 테이블 */}
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f2e8e8" }}>
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
                  {/* 제목 클릭 시 상세 페이지 링크 */}
                  <Link href={`/management/qna/${post.id}`} passHref>
                    <Typography
                      sx={{
                        color: post.category === "notice" ? "#dd0000" : "grey",
                        cursor: "pointer",
                        textDecoration: "underline",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {post.category === "notice" && "🚨"}{" "}
                      {/* 공지글이면 사이렌 이모지 */}
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

      {/* 11. 페이지네이션 UI */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(searchedPosts.length / PAGE_SIZE)}
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

      {/* 12. 글쓰기 버튼 */}
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

      {/* 13. 글쓰기 다이얼로그 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          게시판 글쓰기
        </DialogTitle>
        <Divider
          sx={{
            borderBottomWidth: 2,
            borderColor: "#dd8080",
            width: "95%",
            mx: "auto",
          }}
        />
        <DialogContent>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {/* 카테고리 선택 */}
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="common">일반글</MenuItem>
              <MenuItem value="notice">공지글</MenuItem>
            </Select>

            {/* 제목 입력 */}
            <TextField
              label="제목"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              error={titleError}
              helperText={titleError ? "제목을 입력해주세요" : ""}
            />
          </Box>

          {/* 내용 입력창 */}
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
