export default function HeaderTabs({ showSidebar, onSidebarOpen }) {
  return (
    <Box
      sx={{
        height: 48,
        bgcolor: "#f5f5f5",
        borderBottom: "1px solid #ccc",
        px: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {!showSidebar && (
        <IconButton size="small" onClick={onSidebarOpen}>
          <EastIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
