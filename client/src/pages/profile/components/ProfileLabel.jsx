import { Box, Typography } from "@mui/material";
import React from "react";

function ProfileLabel() {
  return (
    <Box
      sx={{
        marginBottom: "40px",
      }}
    >
      <Typography
        color={"rgb(52, 71, 103)"}
        sx={{
          fontWeight: 500,
          fontSize: "20px",
          textTransform: "capitalize",
        }}
      >
        Create Collection
      </Typography>
      <Typography
        sx={{
          fontSize: "13px",
          color: "#919aa3",
          marginTop: "10px",
          textTransform: "capitalize",
        }}
      >
        lorem ipsum dolor sit amet, consectetur adipisicing
      </Typography>
    </Box>
  );
}

export default ProfileLabel;
