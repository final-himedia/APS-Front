import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        시나리오 추가
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
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

      <DialogActions>
        <Button onClick={handleAdd} variant="contained">
          추가
        </Button>
        <Button onClick={onClose} variant="outlined">
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}
