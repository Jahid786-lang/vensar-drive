import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Add from "@mui/icons-material/Add";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
// import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { mockFolders, mockFiles, type FileItem } from "@/data/mockFiles";
import { DashboardLayout } from "../layout/DashboardLayout";

const fileTypeIcons: Record<FileItem["type"], React.ReactNode> = {
  pdf: <PictureAsPdfOutlined sx={{ color: "error.dark" }} />,
  dwg: (
    <Box
      component="span"
      sx={{ width: 24, height: 24, bgcolor: "info.main", borderRadius: 0.5 }}
    />
  ),
  pptx: (
    <Box
      component="span"
      sx={{ width: 24, height: 24, bgcolor: "warning.dark", borderRadius: 0.5 }}
    />
  ),
  xlsx: (
    <Box
      component="span"
      sx={{ width: 24, height: 24, bgcolor: "success.dark", borderRadius: 0.5 }}
    />
  ),
  zip: <FolderOutlined sx={{ color: "grey.600" }} />,
  folder: <FolderOutlined sx={{ color: "warning.main" }} />,
};

export function FileExplorer() {
  const [contextMenu, setContextMenu] = useState<{
    anchor: HTMLElement;
    file: FileItem;
  } | null>(null);
  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  return (
    <Box sx={{ minWidth: 0, width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          p: { xs: 0.5, sm: 1 },
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search in Automation"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: { sm: '1 1 280px' },
            minWidth: 0,
            maxWidth: { xs: "100%", sm: 480 },
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.paper",
              borderRadius: 2,
            },
          }}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minWidth: 0 }}>
          {/* <IconButton
            size="small"
            sx={{ border: "1px solid", borderColor: "Boxider" }}
          >
            <GridViewOutlined fontSize="small" />
          </IconButton> */}
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            endIcon={<ExpandMore />}
            onClick={(e) => setNewMenuAnchor(e.currentTarget)}
            sx={{
              textTransform: "none",
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
            }}
          >
            New
          </Button>
          <Menu
            anchorEl={newMenuAnchor}
            open={!!newMenuAnchor}
            onClose={() => setNewMenuAnchor(null)}
          >
            <MenuItem onClick={() => setNewMenuAnchor(null)}>
              New Folder
            </MenuItem>
            <MenuItem onClick={() => setNewMenuAnchor(null)}>
              New Document
            </MenuItem>
          </Menu>
          <Button
            variant="contained"
            size="small"
            startIcon={<CloudUploadOutlined />}
            sx={{ textTransform: "none" }}
          >
            Upload
          </Button>
          <IconButton
            size="small"
            sx={{ border: "1px solid", borderColor: "divider" }}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={filterAnchor}
            open={!!filterAnchor}
            onClose={() => setFilterAnchor(null)}
          >
            <MenuItem onClick={() => setFilterAnchor(null)}>All</MenuItem>
            <MenuItem onClick={() => setFilterAnchor(null)}>Size</MenuItem>
            <MenuItem onClick={() => setFilterAnchor(null)}>name</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box

        sx={{
          display: "flex",
          gap: { xs: 1, sm: 1 },
          mb: 1,
          overflowX: "auto",
          minWidth: 0,
          pb: 0.5,
          "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar mobile
        }}
      >
        {mockFolders.map((folder) => (
          <Paper
            key={folder.id}
            elevation={0}
            sx={{
              p: { xs: 1, sm: 0.5 },
              minWidth: { xs: 70, sm: 80 },
              flexShrink: 0,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              textAlign: "center",
              transition: "0.2s",
              "&:hover": {
                bgcolor: "action.hover",
                transform: "translateY(-2px)",
              },
            }}
          >
            <FolderOutlined
              sx={{
                fontSize: { xs: 32, sm: 36 },
                color: "warning.main",
              }}
            />

            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              {folder.name}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.6rem", sm: "0.65rem" },
                color: "text.secondary",
              }}
            >
              {folder.fileCount} Files
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <List disablePadding>
          {mockFiles.map((file) => (
            <ListItem
              key={file.id}
              divider
              sx={{
                "&:hover": { bgcolor: "action.hover" },
                "&:last-child": { borderBottom: "none" },
                flexWrap: "wrap",
              }}
              secondaryAction={
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextMenu({ anchor: e.currentTarget, file });
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              }
            >
              <ListItemIcon sx={{ minWidth: { xs: 36, sm: 40 } }}>
                {fileTypeIcons[file.type]}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: { xs: 0.5, sm: 2 },
                      mt: 0.25,
                    }}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {file.size}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {file.modified}
                    </Typography>
                  </Box>
                }
                slotProps={{ primary: { fontWeight: 500, noWrap: true } }}
              />
            </ListItem>
          ))}
        </List>
        <Menu
          anchorEl={contextMenu?.anchor}
          open={!!contextMenu}
          onClose={() => setContextMenu(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => setContextMenu(null)}>Open</MenuItem>
          <MenuItem onClick={() => setContextMenu(null)}>Share</MenuItem>
          <MenuItem onClick={() => setContextMenu(null)}>Download</MenuItem>
          <MenuItem onClick={() => setContextMenu(null)}>Rename</MenuItem>
          {/* <MenuItem onClick={() => setContextMenu(null)}>Move to (Shift + M)</MenuItem> */}
          <MenuItem
            onClick={() => setContextMenu(null)}
            sx={{ color: "error.main" }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {mockFiles.length} files 27.4 MB
      </Typography>
    </Box>
  );
}
