import * as React from "react";
import { Link } from "react-router-dom";
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
import Box from "@mui/material/Box";
import { deleteCollection } from "../../fetch/apies";

export default function CollectionCard({
  collection,
  collections,
  setCollections,
}) {
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const deleteCollectionBtn = (e) => {
    deleteCollection(collection.id, current_user.token).then((res) => {
      console.log(res);
      if (res.status === 202) {
        let filtered = collections.filter((el) => el.id !== collection.id);
        setCollections(filtered);
      }
    });
  };

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
      <MenuItem onClick={(e) => deleteCollectionBtn(e)}>Delete</MenuItem>
    </Menu>
  );

  return (
    <Card
      sx={{
        maxWidth: 345,
        background: "#fff",
        borderRadius: "5px",
        boxShadow: "0 1px 20px 0 rgb(69 90 100 / 8%)",
      }}
    >
      <CardHeader
        action={
          <IconButton
            aria-label="settings"
            aria-controls={menuId}
            onClick={handleProfileMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={<Typography variant="subtitle1">{collection.name}</Typography>}
        subheader={collection.created_at}
      />
      {renderMenu}
      <CardMedia
        component="img"
        height="194"
        image={`${process.env.REACT_APP_BACKEND_API}/images/${collection.image_id}/${collection.image_url}`}
        alt="Paella dish"
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {collection.description}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        {/* <Button size="small" sx={{ textTransform: "none", mr: "15px" }}>
          See More
        </Button> */}
        <Link
          to={`/profile/collection-items/${collection.id}`}
          style={{ textDecoration: "none" }}
        >
          <Button sx={{ textTransform: "none" }}>Add Items</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
