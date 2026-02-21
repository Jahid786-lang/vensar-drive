import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useAuth } from "@/contexts/AuthContext";
import { getSidebarConfig, type SidebarNavItem } from "@/config/sidebarConfig";
import type { UserRole } from "@/constants/roles";
import {
  useSidebar,
  SIDEBAR_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
  TOP_BAR_HEIGHT,
} from "./SidebarContext";
import { NavSubTree } from "./NavPathTree";

function isItemActive(item: SidebarNavItem, pathname: string): boolean {
  if (item.pathPrefix) return pathname === item.path || pathname.startsWith(item.pathPrefix);
  if (item.path) return pathname === item.path;
  return false;
}

function isParentActive(item: SidebarNavItem, pathname: string): boolean {
  if (isItemActive(item, pathname)) return true;
  return item.children?.some((c) => isItemActive(c, pathname)) ?? false;
}

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role: UserRole | undefined = user?.role;
  const { sidebarOpen, setSidebarOpen, mobileOpen, setMobileOpen, isMobile } =
    useSidebar();
  const config = getSidebarConfig(role);
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const pathname = location.pathname;
    const ids = new Set<string>();
    config.mainItems.forEach((item) => {
      if (item.children && isParentActive(item, pathname)) ids.add(item.id);
    });
    return ids;
  });

  const toggleOpen = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const drawerWidth = isMobile
    ? 280
    : sidebarOpen
      ? SIDEBAR_WIDTH
      : SIDEBAR_COLLAPSED_WIDTH;
  const collapsed = !isMobile && !sidebarOpen;

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    if (isMobile) setMobileOpen(false);
    navigate("/login", { state: { from: { pathname: "/" } }, replace: true });
    logout();
  };

  const content = (
    <Box
      sx={{
        py: collapsed ? 1 : 2,
        px: collapsed ? 0.5 : 1.5,
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isMobile && (
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          startIcon={sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          sx={{
            mx: 0.5,
            mb: 1,
            justifyContent: collapsed ? "center" : "flex-start",
            minWidth: collapsed ? 40 : "auto",
            px: collapsed ? 0.5 : 1.5,
            color: "text.secondary",
            textTransform: "none",
            "& .MuiButton-startIcon": { marginRight: collapsed ? 0 : 1 },
          }}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen && "Close"}
        </Button>
      )}

      <List disablePadding sx={{ mt: 0.1, flex: 1, minHeight: 0, overflow: "auto" }}>
        {config.mainItems
          .filter((item) => !item.roles || (role && item.roles.includes(role)))
          .map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0 && !collapsed;
            const isSelected = !hasChildren && isItemActive(item, location.pathname);
            const isParentSelected = hasChildren && isParentActive(item, location.pathname);
            const isOpen = openIds.has(item.id);

            if (hasChildren) {
              return (
                <Box key={item.id}>
                  <ListItemButton
                    selected={isParentSelected}
                    onClick={() => toggleOpen(item.id)}
                    sx={{
                      borderRadius: 0.5,
                      my: 0.6,
                      justifyContent: "flex-start",
                      px: 1.5,
                      borderLeft: isParentSelected ? "3px solid" : "3px solid transparent",
                      borderColor: "primary.main",
                      bgcolor: isParentSelected ? "primary.main" : "transparent",
                      color: isParentSelected ? "primary.main" : "text.primary",
                      "&:hover": { bgcolor: isParentSelected ? "primary.dark" : "action.hover" },
                      "& .MuiListItemIcon-root": { minWidth: 36 },
                      p: 0.2,
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.label} slotProps={{ primary: { fontSize: "0.9rem" } }} />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isItemActive(child, location.pathname);
                        return (
                          <ListItemButton
                            key={child.id}
                            selected={childActive}
                            onClick={() => child.path && handleNav(child.path)}
                            sx={{
                              borderRadius: 0.5,
                              my: 0.25,
                              py: 0.5,
                              "& .MuiListItemIcon-root": { minWidth: 32 },
                            }}
                          >
                            <ListItemIcon sx={{ color: childActive ? "primary.main" : "text.secondary" }}>
                              <ChildIcon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={child.label}
                              slotProps={{ primary: { fontSize: "0.85rem" } }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            const navPath = item.path ?? "/";
            return (
              <Box key={item.id}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleNav(navPath)}
                  sx={{
                    borderRadius: 0.5,
                    my: 0.6,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1 : 1.5,
                    borderLeft: isSelected ? "3px solid" : "3px solid transparent",
                    borderColor: isSelected ? "primary.main" : "grey.400",
                    bgcolor: isSelected ? "primary.main" : "transparent",
                    color: isSelected ? "primary.main" : "text.primary",
                    "&:hover": { bgcolor: isSelected ? "primary.dark" : "action.hover" },
                    "& .MuiListItemIcon-root": { minWidth: collapsed ? 0 : 36 },
                    p: 0.2,
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? "primary.main" : "text.secondary" }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText primary={item.label} slotProps={{ primary: { fontSize: "0.9rem" } }} />
                  )}
                </ListItemButton>
                {!collapsed && <NavSubTree itemId={item.id} />}
              </Box>
            );
          })}
      </List>

      {/* Bottom section: Shared with me + Logout – stays visible */}
      <Box sx={{ flexShrink: 0, mt: "auto", pt: 1, borderTop: 1, borderColor: "divider" }}>
        {/* {!collapsed && config.sharedItems.length > 0 && (
          <Typography
            variant="overline"
            sx={{
              px: 1.5,
              py: 0.5,
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.7rem",
              display: "block",
              letterSpacing: "0.08em",
            }}
          >
            Shared with me
          </Typography>
        )}
        <List disablePadding sx={{ mt: 0.25 }}>
          {config.sharedItems.map((item) => {
            const Icon = item.icon;
            const isSelected = item.path ? location.pathname === item.path : false;
            return (
              <ListItemButton
                key={item.id}
                selected={isSelected}
                onClick={() => item.path && handleNav(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.25,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 1 : 1.5,
                  "& .MuiListItemIcon-root": { minWidth: collapsed ? 0 : 36 },
                  py: 0.75,
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? "primary.main" : "text.secondary" }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary={item.label} slotProps={{ primary: { fontSize: "0.9rem" } }} />
                )}
              </ListItemButton>
            );
          })}
        </List> */}
        {/* <Divider sx={{ my: 0.5, mx: 1 }} /> */}
        <List disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 1 : 1.5,
              "& .MuiListItemIcon-root": { minWidth: collapsed ? 0 : 36 },
              py: 0.75,
              color: "error.main",
              "&:hover": { bgcolor: "action.hover" },
            }}
            aria-label="Sign out"
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Logout" slotProps={{ primary: { fontSize: "0.9rem", fontWeight: 600 } }} />
            )}
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: 56,
            height: "calc(100vh - 56px)",
            pt: 0,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: TOP_BAR_HEIGHT,
          height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          transition: (theme) =>
            theme.transitions.create("width", {
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {content}
    </Drawer>
  );
}
