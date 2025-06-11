import { Button, Menu, MenuItem, Box, Stack } from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function Toolbar() {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportOpen = Boolean(exportAnchorEl);

  const handleExportClick = (e) => {
    setExportAnchorEl(e.currentTarget);
  };
  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between", // 양쪽 정렬
        alignItems: "center",
        flexWrap: "wrap", // 줄바꿈 허용
        gap: 1,
        p: 1,
        backgroundColor: "#f9f9f9",
        border: "1px solid #d0d7e2",
        borderRadius: 1,
        mb: 1,
      }}
    >
      {/* 왼쪽: 데이터 관련 버튼 */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <div>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileUploadIcon fontSize="small" />}
            onClick={handleExportClick}
            sx={{ px: 1.5 }}
          >
            데이터 내보내기
          </Button>
          <Menu
            anchorEl={exportAnchorEl}
            open={exportOpen}
            onClose={handleExportClose}
          >
            <MenuItem onClick={handleExportClose}>Excel 다운로드</MenuItem>
            <MenuItem onClick={handleExportClose}>CSV 다운로드</MenuItem>
          </Menu>
        </div>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FileDownloadIcon fontSize="small" />}
          sx={{ px: 1.5 }}
        >
          데이터 가져오기
        </Button>
      </Stack>

      {/* 오른쪽: 작업 버튼 */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon fontSize="small" />}
        >
          추가
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DeleteIcon fontSize="small" />}
        >
          삭제
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<SaveIcon fontSize="small" />}
          disabled
        >
          저장
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<SaveIcon fontSize="small" />}
        >
          레이아웃 저장
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DeleteIcon fontSize="small" />}
          disabled
        >
          레이아웃 삭제
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon fontSize="small" />}
        >
          새로고침
        </Button>
      </Stack>
    </Box>
  );
}
