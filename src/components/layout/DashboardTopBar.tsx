import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import HamburgerIcon from "@mui/icons-material/Menu";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import PersonAddOutlined from "@mui/icons-material/PersonAddOutlined";
import AddCircleOutlined from "@mui/icons-material/AddCircleOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "./SidebarContext";
import { isAdminOrAbove } from "@/constants/roles";
import { APP_NAME } from "@/api/config";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const navLinks = [
  { label: "Dashboard", path: "/" },
  // { label: "Documents", path: "/documents" },
];

// const adminOnlyNavLinks = [{ label: "Events", path: "/events" }];

const configMenuItems = [
  { label: "Add User", path: "/users/create", icon: PersonAddOutlined },
  { label: "Add Service", path: "/services/create", icon: AddCircleOutlined },
  { label: "All Users", path: "/users", icon: PeopleOutlined },
  // { label: "Admin", path: "/admin", icon: SettingsOutlined },
];

function isLinkActive(path: string, pathname: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

function isConfigActive(pathname: string): boolean {
  return configMenuItems.some(
    (item) => pathname === item.path || pathname.startsWith(item.path + "/"),
  );
}

export function DashboardTopBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = !useMediaQuery(theme.breakpoints.up("md"));
  const { user } = useAuth();
  const { setMobileOpen } = useSidebar();
  const [configAnchor, setConfigAnchor] = useState<null | HTMLElement>(null);
  const showAdminNav = isAdminOrAbove(user?.role);

  const handleConfigOpen = (e: React.MouseEvent<HTMLElement>) =>
    setConfigAnchor(e.currentTarget);
  const handleConfigClose = () => setConfigAnchor(null);
  const handleConfigItem = (path: string) => {
    navigate(path);
    handleConfigClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        disableGutters
        sx={{ px: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 } }}
      >
        {isMobile && (
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 0.5 }}
            aria-label="Open menu"
          >
            <HamburgerIcon />
          </IconButton>
        )}
        <Box sx={{ display: "flex", gap: 0.5, mr: { xs: 1, sm: 3 } }}>
          <img
            src="/logo.png"
            alt="Vensar Drive"
            // style={{ height: 32, }}
            className="topbar-illustration"
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "primary.dark",
              fontSize: {
                xs: "1rem",
                sm: "1rem",
                display: "flex",
                // justifyContent: "center",
                alignItems: "flex-end",
              },
            }}
          >
            {APP_NAME}
          </Typography>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flex: 1 }}>
          {navLinks.map((link) => {
            const active = isLinkActive(link.path, location.pathname);
            return (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={{
                  color: active ? "primary.main" : "text.secondary",
                  textTransform: "none",
                  fontWeight: active ? 600 : 500,
                  borderBottom: active ? "2px solid" : "none",
                  borderColor: "primary.main",
                  borderRadius: 0,
                  "&:hover": { color: "primary.main", bgcolor: "action.hover" },
                }}
              >
                {link.label}
              </Button>
            );
          })}
          {/* {showAdminNav &&
            adminOnlyNavLinks.map((link) => {
              const active = isLinkActive(link.path, location.pathname);
              return (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: active ? "primary.main" : "text.secondary",
                    textTransform: "none",
                    fontWeight: active ? 600 : 500,
                    borderBottom: active ? "2px solid" : "none",
                    borderColor: "primary.main",
                    borderRadius: 0,
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })} */}
          {showAdminNav && (
            <>
              <Button
                onClick={handleConfigOpen}
                endIcon={<ArrowDropDown />}
                sx={{
                  color: isConfigActive(location.pathname)
                    ? "primary.main"
                    : "text.secondary",
                  textTransform: "none",
                  fontWeight: isConfigActive(location.pathname) ? 600 : 500,
                  borderBottom: isConfigActive(location.pathname)
                    ? "2px solid"
                    : "none",
                  borderColor: "primary.main",
                  borderRadius: 0,
                  "&:hover": { color: "primary.main", bgcolor: "action.hover" },
                }}
              >
                Configuration
              </Button>
              <Menu
                anchorEl={configAnchor}
                open={Boolean(configAnchor)}
                onClose={handleConfigClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{ paper: { sx: { minWidth: 200 } } }}
              >
                {configMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <MenuItem
                      key={item.path}
                      onClick={() => handleConfigItem(item.path)}
                    >
                      <ListItemIcon>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>{item.label}</ListItemText>
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            marginLeft: "auto",
          }}
        >
          <Button
            onClick={() => navigate("/profile")}
            size="small"
            sx={{
              color: "text.primary",
              textTransform: "none",
              "& .MuiButton-endIcon": { ml: 0.25 },
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
            >
              Welcome, {user?.name ?? user?.email?.split("@")[0] ?? "User"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, display: { xs: "block", sm: "none" } }}
            >
              {user?.name ?? "User"}
            </Typography>
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="Vensar Drive"
                style={{ height: 32, objectFit: "contain" }}
              />
            ) : (
              <AccountCircleIcon fontSize="medium" />
            )}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
