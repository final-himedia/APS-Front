import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export default function ScenarioAddDialog({ open, onClose, onSubmit }) {
  const [scenarioId, setScenarioId] = useState("");
  const [scenarioName, setScenarioName] = useState("");

  const handleAdd = () => {
    if (!scenarioId.trim()) {
      alert("시나리오 ID는 필수입니다.");
      return;
    }
    onSubmit({ scenarioId, scenarioName });
    setScenarioId("");
    setScenarioName("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      {/* 타이틀 + 닫기 버튼 + divider 선 */}
      <Box sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box component="span" fontSize="1.1rem" fontWeight="bold">
            시나리오 추가
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Divider sx={{ width: "90%", borderColor: "#ddd" }} />
      </Box>

      {/* 입력 영역 (아래 선 없음) */}
      <DialogContent
        sx={{
          pt: 3,
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="시나리오 ID"
            required
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
            fullWidth
          />
          <TextField
            label="시나리오 이름"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>

      {/* 버튼 영역 */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{
            backgroundColor: "#dd0000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#bb0000",
            },
          }}
        >
          추가
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#dd0000",
            color: "#dd0000",
            "&:hover": {
              borderColor: "#bb0000",
              color: "#bb0000",
              backgroundColor: "#fff5f5",
            },
          }}
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}
