import {
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SidebarSearch from "./SidebarSearch";


import { Divider } from "@mui/material";



const scenarioIds = [
  "S010000",
  "S020000",
  "S030000",
  "S040000",
  "S050000",
  "S060000",
];

export default function ScenarioList({ listKey, onClose }) {
  return (

    <Box
      sx={{
        width: 240,
        borderRight: "1px solid #ccc",
        height: "100vh",
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* 상단: 제목 + 검색 + 접기 버튼 */}
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 0,
    height: 100,
  }}
>
  <Box sx={{ width: "100%" }}>
    {/* 시나리오 목록 + 아이콘을 한 줄에 배치 */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 0.7,
        pr: 2, 
      }}
    >
      <Typography variant="h6">시나리오 목록</Typography>
      <IconButton onClick={onClose} size="small">
        <ArrowForwardIosIcon
          fontSize="small"
          sx={{
            transform: "rotate(180deg)",
            transition: "transform 0.3s",
          }}
        />
      </IconButton>
    </Box>

    <SidebarSearch />
    <Divider sx={{ width: 220, my: 1 }} />
  </Box>
</Box>


      {/* 시나리오 항목 */}

      <List dense>
        {scenarioIds.map((id) => (
          <ListItem key={id} button disablePadding>
            <ListItemText primary={id} sx={{ pl: 0 }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
