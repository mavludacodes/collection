import * as React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PeopleIcon from "@mui/icons-material/People";
import CollectionsIcon from "@mui/icons-material/Collections";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const drawerWidth = 240;

function ProfileSidebar(props) {
  console.log(props.change);
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  console.log(current_user.role);
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      path: "users",
      name: "Users",
      icon: <PeopleIcon />,
      role: "admin",
    },
    {
      path: "create-collection",
      name: "Create Collection",
      icon: <CollectionsIcon />,
      role: "user",
    },
    {
      path: "my-collections",
      name: "My Collections",
      icon: <CollectionsIcon />,
      role: "user",
    },
  ];
  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item, index) => {
          if (item.role === current_user.role)
            return (
              <ListItem
                key={index}
                disablePadding
                onClick={() => navigate(`/profile/${item.path}`)}
                sx={{
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                }}
              >
                <ListItemButton>
                  <ListItemIcon sx={{ color: "#F6F9FC" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} sx={{ color: "#F6F9FC" }} />
                </ListItemButton>
              </ListItem>
            );
        })}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutBtn = (e) => {
    e.preventDefault();
    localStorage.removeItem("current_user");
    handleClose();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          // boxShadow: "none",
          boxShadow: "0 0 11px rgb(0 0 0 / 13%)",
          background: "#fff",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "rgb(52, 71, 103)" }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            color={"rgb(52, 71, 103)"}
          >
            Profile
          </Typography> */}
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ color: "rgb(52, 71, 103)" }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logoutBtn}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "rgb(52, 71, 103)",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "rgb(52, 71, 103)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

ProfileSidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.change === nextProps.change) {
    return true; // donot re-render
  }
  return false; // will re-render
};

export default React.memo(ProfileSidebar, areEqual);
