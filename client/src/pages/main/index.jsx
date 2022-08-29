import { Typography, Box } from "@mui/material";
import React from "react";
import ListItems from "./ListItems";
import TopCollections from "./TopCollections";

function Main() {
  return (
    <div>
      <Box sx={{ background: "#F6F9FC", p: "20px", my: "40px" }}>
        <Typography
          sx={{
            m: "40px",
            fontFamily: "Roboto Slab, sans-serif",
            fontSize: "2.25rem",
            lineHeight: "1.3",
            fontWeight: "700",
            opacity: "1",
            textTransform: "none",
            verticalAlign: "unset",
            textDecoration: "none",
            color: "rgb(52, 71, 103)",
            letterSpacing: "-0.125px",
            textAlign: "center",
          }}
        >
          The latest works of our Authors
        </Typography>
      </Box>
      <ListItems />
      <Box sx={{ background: "#F6F9FC", p: "20px", my: "40px" }}>
        <Typography
          sx={{
            m: "40px",
            fontFamily: "Roboto Slab, sans-serif",
            fontSize: "2.25rem",
            lineHeight: "1.3",
            fontWeight: "700",
            opacity: "1",
            textTransform: "none",
            verticalAlign: "unset",
            textDecoration: "none",
            color: "rgb(52, 71, 103)",
            letterSpacing: "-0.125px",
            textAlign: "center",
          }}
        >
          Top Collections
        </Typography>
      </Box>
      <TopCollections />
      <Box sx={{ background: "#F6F9FC", height: "160px" }}></Box>
    </div>
  );
}

export default Main;
