import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export default function TopCollections() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
      <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
    </Menu>
  );

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((el) => (
        <Card
          sx={{
            maxWidth: 260,
            mr: "20px",
            mb: "20px",
            background: "#F6F9FC",
            border: "none",
            boxShadow: "none",
            borderRadius: "0",
          }}
        >
          <CardHeader
            title={
              <Typography variant="subtitle2">
                Shrimp and Chorizo Paella
              </Typography>
            }
            subheader={
              <Typography sx={{ fontSize: "12px" }}>
                September 14, 2016
              </Typography>
            }
          />
          {renderMenu}
          <CardMedia
            component="img"
            height="194"
            image="https://static.wixstatic.com/media/bb1bd6_f221ad0f4d6f4103bf1d37b68b04492e~mv2.png/v1/fill/w_1000,h_571,al_c,usm_0.66_1.00_0.01/bb1bd6_f221ad0f4d6f4103bf1d37b68b04492e~mv2.png"
            alt="Paella dish"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              This impressive paella is a perfect party dish and a fun meal to
              cook together with your guests. Add 1 cup of frozen peas along
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
