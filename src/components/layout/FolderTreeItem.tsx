import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Add from "@mui/icons-material/Add";
import type { FolderNode } from "@/types/folder";

interface FolderTreeItemProps {
  node: FolderNode;
  depth?: number;
  openIds: Set<string>;
  onToggle: (id: string) => void;
  onAddFolder?: (parentId: string) => void;
  collapsed?: boolean;
  onSidebarExpand?: () => void;
}

export function FolderTreeItem({
  node,
  depth = 0,
  openIds,
  onToggle,
  onAddFolder,
  collapsed = false,
  onSidebarExpand,
}: FolderTreeItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasChildren = node.children.length > 0;
  const isOpen = openIds.has(node.id);
  const isSelected = location.pathname === node.path;
  const pl = collapsed ? 1 : 1.5 + depth * 1.5;

  const handleRowClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button[data-tree-toggle]")) return;
    if ((e.target as HTMLElement).closest("button[data-tree-add]")) return;
    navigate(node.path);
  };

  if (collapsed) {
    return (
      <ListItemButton
        onClick={onSidebarExpand}
        sx={{
          borderRadius: 0.5,
          my: 0.25,
          justifyContent: "center",
          px: 0.5,
          "& .MuiListItemIcon-root": { minWidth: 0 },
        }}
        title={node.name}
      >
        <ListItemIcon>
          <FolderOutlined fontSize="small" />
        </ListItemIcon>
      </ListItemButton>
    );
  }

  return (
    <Box sx={{ pl: depth > 0 ? pl : 0 }}>
      <ListItemButton
        selected={isSelected}
        onClick={handleRowClick}
        sx={{
          borderRadius: 0.5,
          my: 0.25,
          py: 0.25,
          pl: pl,
          "& .MuiListItemIcon-root": { minWidth: 32 },
        }}
      >
        <ListItemIcon sx={{ color: "text.secondary" }}>
          <FolderOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={node.name}
          slotProps={{ primary: { fontSize: "0.85rem" } }}
        />
        {onAddFolder && (
          <IconButton
            size="small"
            data-tree-add
            onClick={(e) => {
              e.stopPropagation();
              onAddFolder(node.id);
            }}
            sx={{ p: 0.25 }}
            aria-label={`New folder in ${node.name}`}
            title="New folder"
          >
            <Add fontSize="small" />
          </IconButton>
        )}
        {hasChildren && (
          <IconButton
            size="small"
            data-tree-toggle
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            sx={{ p: 0.25 }}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </IconButton>
        )}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {node.children.map((child) => (
              <FolderTreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                openIds={openIds}
                onToggle={onToggle}
                onAddFolder={onAddFolder}
                onSidebarExpand={onSidebarExpand}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
}
