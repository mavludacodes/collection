import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ImageListItem from "@mui/material/ImageListItem";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Typography } from "@mui/material";

import { getAllItems } from "../../fetch/main";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function ListItems() {
  const navigate = useNavigate();
  const navigateBtn = (e, id) => {
    e.preventDefault();
    navigate(`/item/${id}`);
  };

  const [items, setItems] = useState();
  useEffect(() => {
    getAllItems().then((res) => {
      setItems(res);
    });
  }, []);

  return (
    <Container maxWidth="md">
      <ImageList variant="masonry" cols={3} gap={12}>
        {items &&
          items.map((item) => (
            <ImageListItem key={item.id}>
              <img
                src={`${process.env.REACT_APP_BACKEND_API}/images/${item.image_id}/${item.image_url}`}
                srcSet={`${process.env.REACT_APP_BACKEND_API}/images/${item.image_id}/${item.image_url}`}
                alt={item.name}
              />
              <ImageListItemBar
                //   sx={{ background: "rgba(52, 71, 103, 0.74)" }}
                title={
                  <Typography
                    onClick={(e) => navigateBtn(e, item.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    {item.title}
                  </Typography>
                }
                subtitle={item.author}
                actionIcon={
                  <Checkbox
                    {...label}
                    icon={<FavoriteRoundedIcon sx={{ color: "#fff" }} />}
                    checkedIcon={<Favorite sx={{ color: "red" }} />}
                  />
                }
              />
            </ImageListItem>
          ))}
      </ImageList>
    </Container>
  );
}
