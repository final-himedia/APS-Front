"use client";

import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SidebarSearch({ searchTerm, onSearchChange }) {
  return (
    <TextField
      placeholder="검색"
      variant="outlined"
      size="small"
      fullWidth
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      sx={{
        height: 32,
        width: 210,
        "& .MuiInputBase-root": {
          height: 32,
          backgroundColor: "#f5f5f5",
          
        },
      }}
    />
  );
}
