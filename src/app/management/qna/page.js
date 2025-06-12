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
} from "@mui/material";
import { useState, useEffect } from "react";

const PAGE_SIZE = 5;

export default function QnaPage() {
  const [tab, setTab] = useState(0);
  const [searchType, setSearchType] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/management/qna")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ QnA 응답 확인:", data);
        setPosts(data.filter((d) => !d.deleted));
      })
      .catch((err) => console.error("❌ QnA fetch 에러:", err));
  }, []);

  const paginatedPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "1000px",
        mx: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Q&A 게시판
      </Typography>

      {/* 검색 영역 */}
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
          sx={{ width: 300 }}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#eeeeee",
            color: "#000",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#e0e0e0",
              borderColor: "#e0e0e0",
              boxShadow: "none",
            },
          }}
        >
          검색
        </Button>
      </Stack>

      {/* 탭 */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="전체" />
        <Tab label="공지" />
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
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.writerId}</TableCell>
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
        />
      </Box>

      {/* 글쓰기 버튼 */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          sx={{
            px: 3,
            py: 1,
            borderRadius: "12px",
            backgroundColor: "#f5f5f5",
            "&:hover": {
              backgroundColor: "#e0e0e0",
              borderColor: "#e0e0e0",
            },
          }}
        >
          글쓰기
        </Button>
      </Box>
    </Box>
  );
}
