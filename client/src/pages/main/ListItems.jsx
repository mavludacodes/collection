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
  const navigateBtn = () => {
    navigate("/item");
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
            <ImageListItem key={item.img}>
              <img
                src={`${process.env.REACT_APP_BACKEND_API}/images/${item.image_id}/${item.image_url}`}
                srcSet={`${process.env.REACT_APP_BACKEND_API}/images/${item.image_id}/${item.image_url}`}
                alt={item.name}
                loading="lazy"
              />
              <ImageListItemBar
                //   sx={{ background: "rgba(52, 71, 103, 0.74)" }}
                title={
                  <Typography onClick={navigateBtn} sx={{ cursor: "pointer" }}>
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

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
    title: "Bed",
  },
  {
    img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
    title: "Books",
  },
  {
    img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    title: "Sink",
  },
  {
    img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
    title: "Kitchen",
  },
  {
    img: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3",
    title: "Blinds",
  },
  {
    img: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
    title: "Chairs",
  },
  {
    img: "https://images.unsplash.com/photo-1530731141654-5993c3016c77",
    title: "Laptop",
  },
  {
    img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61",
    title: "Doors",
  },
  {
    img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee",
    title: "Storage",
  },
  {
    img: "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62",
    title: "Candle",
  },
  {
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    title: "Coffee table",
  },
];
