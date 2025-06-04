import ListDivider from "./dashboard/ListDivider"; // ✅ default import
import InputDataPanel from "./dashboard/InputDataPanel"; // ✅ default import
import Box from "@mui/material/Box";

export default function HomePage() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <ListDivider />
      <Box sx={{ flexGrow: 1, backgroundColor: "#f9f9f9" }}>
        {/* 중앙 content 자리 */}
      </Box>
      <InputDataPanel />
    </Box>
  );
}
